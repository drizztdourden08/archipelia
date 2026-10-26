/* @layer tests @kind test */
import { readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import type { PythonRun } from '../../src/process/run-python.type';
import { installWheel } from '../../src/wheel/install-wheel';
import { runtimeOf } from '../install/install-fakes';
import { writeWheelFile } from './wheel.fixtures';

const SHA = 'a'.repeat(64);

type Seen = { args: string[]; cwd: string; requirements?: string; constraints?: string; copied?: boolean };

const fakePip = (code = 0, origin = 'absent') => {
  const seen: Seen[] = [];
  const run = vi.fn(async (_runtime: unknown, { args, cwd }: PythonRun) => {
    const flag = (name: string) => args[args.indexOf(name) + 1] ?? '';
    if (args[1] === '-c') return { code: 0, lines: [origin] };
    if (args.includes('list')) return { code: 0, lines: ['numpy==2.5.1', 'ctrando==1.0.0'] };
    const requirements = await readFile(flag('-r'), 'utf8');
    const address = /@ (file:\/\/\S+)/.exec(requirements)?.[1] ?? '';
    const copied = await stat(fileURLToPath(address)).then(() => true, () => false);
    seen.push({ args, cwd, requirements, constraints: await readFile(flag('-c'), 'utf8'), copied });
    return { code, lines: code === 0 ? [] : ['ERROR: THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE'] };
  });
  return { run, seen };
};

describe('installWheel', () => {
  test('installs one wheel by its hash, with no dependencies and no index, held to the engine packages, from a temp folder', async () => {
    const file = await writeWheelFile('ctrando-1.2.0-py3-none-any.whl');
    const { run, seen } = fakePip();
    await installWheel(runtimeOf('old'), { file, sha256: SHA }, { run });
    const [install] = seen;
    expect(install?.args.slice(0, 4)).toEqual(['-I', '-m', 'pip', 'install']);
    expect(install?.args).toEqual(expect.arrayContaining(['--no-deps', '--no-index', '--require-hashes', '--only-binary=:all:', '--isolated', '--no-input']));
    expect(install?.requirements).toMatch(new RegExp(`^ctrando @ file:///.+ctrando-1\\.2\\.0-py3-none-any\\.whl --hash=sha256:${SHA}$`));
    expect(install?.constraints).toBe('numpy==2.5.1');
    expect(install?.copied).toBe(true);
    expect(install?.cwd.startsWith(tmpdir())).toBe(true);
    expect(await stat(install?.cwd ?? '').then(() => true, () => false)).toBe(false);
  });

  test('refuses a wheel named like a package the engine got from the Python Package Index, and runs no install', async () => {
    const file = await writeWheelFile('websockets-15.0-py3-none-any.whl');
    const { run, seen } = fakePip(0, 'index');
    await expect(installWheel(runtimeOf('old'), { file, sha256: SHA }, { run })).rejects.toThrow('websockets is already in the engine from the Python Package Index');
    expect(seen).toEqual([]);
  });

  test('replaces a wheel it installed itself, and asks the engine Python about the normalized name', async () => {
    const file = await writeWheelFile('Ct_Rando-1.2.0-py3-none-any.whl');
    const { run, seen } = fakePip(0, 'local');
    await installWheel(runtimeOf('old'), { file, sha256: SHA }, { run });
    expect(seen).toHaveLength(1);
    const origin = run.mock.calls.map(([, call]) => call.args).find((args) => args[1] === '-c');
    expect(origin?.slice(0, 2)).toEqual(['-I', '-c']);
    expect(origin?.[3]).toBe('ct-rando');
    expect(origin?.[2]).toContain('direct_url.json');
  });

  test('stops when the engine Python gives no clear answer about the name', async () => {
    const file = await writeWheelFile('ctrando-1.2.0-py3-none-any.whl');
    await expect(installWheel(runtimeOf('old'), { file, sha256: SHA }, { run: fakePip(0, 'maybe').run })).rejects.toThrow('cannot read');
  });

  test('refuses a file that is not a wheel name or has no sha256, before pip runs', async () => {
    const { run } = fakePip();
    await expect(installWheel(runtimeOf('old'), { file: '/x/evil.zip', sha256: SHA }, { run })).rejects.toThrow('is not a wheel file name');
    const file = await writeWheelFile('ctrando-1.2.0-py3-none-any.whl');
    await expect(installWheel(runtimeOf('old'), { file, sha256: 'abc' }, { run })).rejects.toThrow('needs its sha256');
    expect(run).not.toHaveBeenCalled();
  });

  test('a hash pip does not accept stops the install with pip own words', async () => {
    const file = await writeWheelFile('ctrando-1.2.0-py3-none-any.whl');
    await expect(installWheel(runtimeOf('old'), { file, sha256: SHA }, { run: fakePip(1).run })).rejects.toThrow('DO NOT MATCH THE HASHES');
  });
});
