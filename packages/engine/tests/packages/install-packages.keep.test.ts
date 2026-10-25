/* @layer tests @kind test */
import { readFile } from 'node:fs/promises';
import { describe, expect, test, vi } from 'vitest';
import type { PythonRun } from '../../src/process/run-python.type';
import { installPackages } from '../../src/packages/install-packages';
import { runtimeOf } from '../install/install-fakes';

const FROZEN = ['numpy==2.5.1', 'websockets==15.0', 'WARNING: something odd'];

const fakePip = (installResult: { code: number; lines: string[] }) => {
  const seen: { args: string[]; constraints?: string; requirements?: string }[] = [];
  const run = vi.fn(async (_runtime: unknown, { args }: PythonRun) => {
    if (args.includes('list')) {
      seen.push({ args });
      return { code: 0, lines: FROZEN };
    }
    const flag = (name: string) => args[args.indexOf(name) + 1] ?? '';
    seen.push({ args, constraints: await readFile(flag('-c'), 'utf8'), requirements: await readFile(flag('-r'), 'utf8') });
    return installResult;
  });
  return { run, seen };
};

describe('installPackages', () => {
  test('installs into the engine python with its own pip, wheels only, held to the packages the engine has', async () => {
    const { run, seen } = fakePip({ code: 0, lines: ['Installed foo-1.0'] });
    await installPackages(runtimeOf('old'), ['foo==1.0', 'bar>=2'], { run });
    const [, install] = seen;
    expect(run.mock.calls.every(([runtime]) => (runtime as { id: string }).id === 'old')).toBe(true);
    expect(install?.args.slice(0, 3)).toEqual(['-m', 'pip', 'install']);
    expect(install?.args).toEqual(expect.arrayContaining(['--only-binary=:all:', '--isolated', '--no-input']));
    expect(install?.requirements).toBe('foo==1.0\nbar>=2');
    expect(install?.constraints).toBe('numpy==2.5.1\nwebsockets==15.0');
  });

  test('installs nothing and runs nothing for an empty list', async () => {
    const { run } = fakePip({ code: 0, lines: [] });
    await installPackages(runtimeOf('old'), [], { run });
    expect(run).not.toHaveBeenCalled();
  });

  test('a failed install throws pip own last error line', async () => {
    const { run } = fakePip({ code: 1, lines: ['Collecting ctrando', 'ERROR: Could not find a version', 'ERROR: No matching distribution found for ctrando'] });
    await expect(installPackages(runtimeOf('old'), ['ctrando'], { run })).rejects.toThrow('No matching distribution found for ctrando');
  });

  test('a failed install with no error line names the exit code', async () => {
    const { run } = fakePip({ code: 3, lines: [] });
    await expect(installPackages(runtimeOf('old'), ['x'], { run })).rejects.toThrow('pip exited 3');
  });
});
