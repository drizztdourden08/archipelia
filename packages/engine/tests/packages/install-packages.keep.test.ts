/* @layer tests @kind test */
import { readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { describe, expect, test, vi } from 'vitest';
import type { PythonRun } from '../../src/process/run-python.type';
import { installPackages } from '../../src/packages/install-packages';
import { resolvePackages } from '../../src/packages/resolve-packages';
import { runtimeOf } from '../install/install-fakes';

const FROZEN = ['numpy==2.5.1', 'websockets==15.0', 'WARNING: something odd'];

const REPORT = {
  version: '1',
  install: [
    { metadata: { name: 'Foo_Bar', version: '1.0' }, requested: true },
    { metadata: { name: 'dep.one', version: '2.1.3' }, requested: false },
  ],
};

type Seen = { args: string[]; cwd: string; constraints?: string; requirements?: string; report?: string };

const fakePip = (result: { code: number; lines: string[] } = { code: 0, lines: [] }) => {
  const seen: Seen[] = [];
  const run = vi.fn(async (_runtime: unknown, { args, cwd }: PythonRun) => {
    const flag = (name: string) => args[args.indexOf(name) + 1] ?? '';
    if (args.includes('list')) {
      seen.push({ args, cwd });
      return { code: 0, lines: FROZEN };
    }
    const entry: Seen = { args, cwd, constraints: await readFile(flag('-c'), 'utf8'), requirements: await readFile(flag('-r'), 'utf8') };
    seen.push(entry);
    if (args.includes('--report')) await writeFile(flag('--report'), JSON.stringify(REPORT));
    return result;
  });
  return { run, seen };
};

describe('installPackages', () => {
  test('installs exact pins with no dependencies, wheels only, held to the engine packages, in isolated mode from a temp folder', async () => {
    const { run, seen } = fakePip();
    await installPackages(runtimeOf('old'), ['foo==1.0', 'dep-one==2.1.3'], { run });
    const [list, install] = seen;
    expect(run.mock.calls.every(([runtime]) => (runtime as { id: string }).id === 'old')).toBe(true);
    expect(install?.args.slice(0, 4)).toEqual(['-I', '-m', 'pip', 'install']);
    expect(install?.args).toEqual(expect.arrayContaining(['--no-deps', '--only-binary=:all:', '--isolated', '--no-input']));
    expect(install?.requirements).toBe('foo==1.0\ndep-one==2.1.3');
    expect(install?.constraints).toBe('numpy==2.5.1\nwebsockets==15.0');
    expect(list?.args.slice(0, 3)).toEqual(['-I', '-m', 'pip']);
    for (const call of seen) {
      expect(call.cwd.startsWith(tmpdir())).toBe(true);
      expect(call.cwd).not.toContain('engines');
    }
    expect(await stat(install?.cwd ?? '').then(() => true, () => false)).toBe(false);
  });

  test('installs nothing and runs nothing for an empty list', async () => {
    const { run } = fakePip();
    await installPackages(runtimeOf('old'), [], { run });
    expect(run).not.toHaveBeenCalled();
  });

  test('refuses anything that is not an exact pin before it runs pip', async () => {
    const { run } = fakePip();
    for (const loose of ['foo>=1', 'foo', '-r other.txt', 'foo==1.0 --hash=sha256:abc', 'git+https://example.com/x.git']) {
      await expect(installPackages(runtimeOf('old'), [loose], { run })).rejects.toThrow('is not an exact name==version pin');
    }
    expect(run).not.toHaveBeenCalled();
  });

  test('a failed install throws pip own last error line', async () => {
    const { run } = fakePip({ code: 1, lines: ['Collecting ctrando', 'ERROR: Could not find a version', 'ERROR: No matching distribution found for ctrando'] });
    await expect(installPackages(runtimeOf('old'), ['ctrando==1.0'], { run })).rejects.toThrow('No matching distribution found for ctrando');
  });

  test('a failed install with no error line names the exit code', async () => {
    const { run } = fakePip({ code: 3, lines: [] });
    await expect(installPackages(runtimeOf('old'), ['x==1'], { run })).rejects.toThrow('pip exited 3');
  });

  test('absolute paths in the pip error are cut down to the file name', async () => {
    const lines = ['ERROR: Could not open requirements file: C:\\Users\\drizz\\AppData\\Local\\Temp\\archipelia-packages-abc\\requirements.txt'];
    const { run } = fakePip({ code: 1, lines });
    const failure = await installPackages(runtimeOf('old'), ['x==1'], { run }).catch((err: Error) => err.message);
    expect(failure).toBe('Could not open requirements file: requirements.txt');
    const posix = fakePip({ code: 1, lines: ['ERROR: No such file or directory: \'/home/user/.cache/pip/wheels/x.whl\' (see https://pip.pypa.io/en/stable/)'] });
    const message = await installPackages(runtimeOf('old'), ['x==1'], { run: posix.run }).catch((err: Error) => err.message);
    expect(message).toBe('No such file or directory: \'x.whl\' (see https://pip.pypa.io/en/stable/)');
  });
});

describe('resolvePackages', () => {
  test('dry-runs the install with the same flags and constraints and returns the whole resolved set', async () => {
    const { run, seen } = fakePip();
    const resolved = await resolvePackages(runtimeOf('old'), ['Foo_Bar>=1'], { run });
    const dry = seen.find((call) => call.args.includes('--dry-run'));
    expect(dry?.args.slice(0, 4)).toEqual(['-I', '-m', 'pip', 'install']);
    expect(dry?.args).toEqual(expect.arrayContaining(['--report', '--only-binary=:all:', '--isolated', '--no-input', '-c', '-r']));
    expect(dry?.args).not.toContain('--no-deps');
    expect(dry?.requirements).toBe('Foo_Bar>=1');
    expect(dry?.constraints).toBe('numpy==2.5.1\nwebsockets==15.0');
    expect(dry?.cwd.startsWith(tmpdir())).toBe(true);
    expect(resolved).toEqual([
      { name: 'foo-bar', version: '1.0', pin: 'foo-bar==1.0', url: 'https://pypi.org/project/foo-bar/1.0/', direct: true },
      { name: 'dep-one', version: '2.1.3', pin: 'dep-one==2.1.3', url: 'https://pypi.org/project/dep-one/2.1.3/', direct: false },
    ]);
  });

  test('resolves nothing for no requirements and runs nothing', async () => {
    const { run } = fakePip();
    expect(await resolvePackages(runtimeOf('old'), [], { run })).toEqual([]);
    expect(run).not.toHaveBeenCalled();
  });

  test('a report it cannot read is an error, not an empty set', async () => {
    const run = vi.fn(async (_runtime: unknown, { args }: PythonRun) => {
      if (args.includes('--report')) await writeFile(args[args.indexOf('--report') + 1] ?? '', '{"install":[{"metadata":{"name":"x y","version":"1"}}]}');
      return { code: 0, lines: args.includes('list') ? FROZEN : [] };
    });
    await expect(resolvePackages(runtimeOf('old'), ['x'], { run })).rejects.toThrow('pip gave a report Archipelia cannot read');
  });

  test('a conflict with the engine packages fails with pip own reason', async () => {
    const run = vi.fn((_runtime: unknown, { args }: PythonRun) => Promise.resolve(
      args.includes('--dry-run')
        ? { code: 1, lines: ['ERROR: Cannot install foo because these package versions have conflicting dependencies.'] }
        : { code: 0, lines: FROZEN },
    ));
    await expect(resolvePackages(runtimeOf('old'), ['foo'], { run })).rejects.toThrow('Cannot install foo because these package versions have conflicting dependencies');
  });
});
