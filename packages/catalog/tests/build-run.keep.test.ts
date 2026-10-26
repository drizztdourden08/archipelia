/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';
import { COMMIT, WHEEL } from './build.fixtures';
import { behaviour, WHEEL_BYTES, ZIP } from './build-engine.fixtures';
import { wheelBytes } from './wheel.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { venvPython } = await import('@archipelia/engine');
const { bed, exists, registerBuildBed } = await import('./build-bed.fixtures');

const registered = registerBuildBed();

const sha256Of = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

describe('building', () => {
  test('installs the pinned tools, then builds with pip wheel without isolation, dependencies or index, from the unpacked source', async () => {
    const { calls, prepared, requestOf, builds } = bed();
    const done = await builds.build(requestOf(await prepared()));
    expect(done.status).toBe('built');
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'wheel']);
    const [, tools, wheel] = calls;
    expect(tools?.toolsFile).toBe(`setuptools==80.1.0 --hash=sha256:${'a'.repeat(64)}\nwheel==0.45.1 --hash=sha256:${'b'.repeat(64)}`);
    expect(tools?.args).toEqual(expect.arrayContaining(['install', '--only-binary=:all:', '--no-deps', '--require-hashes', '--isolated', '--no-input']));
    expect(wheel?.args.slice(0, 5)).toEqual(['-X', 'utf8', '-I', '-m', 'pip']);
    expect(wheel?.args).toEqual(expect.arrayContaining(['wheel', '--no-deps', '--no-build-isolation', '--no-index', '--isolated', '--no-input']));
    expect(wheel?.sourceSeen).toBe(true);
    expect(wheel?.args.at(-1)).toMatch(/src$/);
  });

  test('runs only the engine Python or the Python of the venv, with no shell, and an environment without the tokens of the user', async () => {
    vi.stubEnv('GH_TOKEN', 'ghp_secret');
    vi.stubEnv('AWS_SECRET_ACCESS_KEY', 'secret');
    vi.stubEnv('CC', 'mycc');
    const { calls, prepared, requestOf, builds, workOf } = bed();
    await builds.build(requestOf(await prepared()));
    const venvPy = venvPython(`${workOf()}venv`);
    expect(calls.map((call) => call.command)).toEqual([(behaviour.runtime as EngineRuntime).python, venvPy, venvPy]);
    for (const call of calls) {
      expect(call.args.some((arg) => /^(?:cmd|powershell|sh|bash|msiexec)(?:\.exe)?$/i.test(arg))).toBe(false);
      expect(call.env).not.toHaveProperty('GH_TOKEN');
      expect(call.env).not.toHaveProperty('AWS_SECRET_ACCESS_KEY');
      expect(call.env).not.toHaveProperty('PATH');
      expect(call.env).toMatchObject({ CC: 'mycc', PIP_NO_INPUT: '1', PYTHONNOUSERSITE: '1' });
    }
  });

  test('records the source: repo, commit, hash of the archive, hash of the wheel and that it was built', async () => {
    const { prepared, requestOf, builds, logs } = bed();
    const done = await builds.build(requestOf(await prepared()));
    expect(done).toEqual({
      status: 'built',
      source: {
        repo: 'Pseudoarc/ctrando', tag: COMMIT, asset: WHEEL, sha256: sha256Of(WHEEL_BYTES), verified: false, name: 'ctrando', version: '1.2.0',
        built: true, commit: COMMIT, archiveSha256: sha256Of(ZIP),
      },
    });
    expect(await registered.cached()).toEqual([sha256Of(WHEEL_BYTES)]);
    expect(logs.join('\n')).toContain(`wheel sha256 ${sha256Of(WHEEL_BYTES)}`);
  });

  test('removes the temporary folder when it is built', async () => {
    const { prepared, requestOf, builds, workOf } = bed();
    const plan = await prepared();
    expect(await exists(workOf())).toBe(true);
    await builds.build(requestOf(plan));
    expect(await exists(workOf())).toBe(false);
  });

  test('removes the temporary folder when the build makes no wheel, and says so', async () => {
    behaviour.wheel = undefined;
    const { prepared, requestOf, builds, workOf } = bed();
    const failed = await builds.build(requestOf(await prepared()));
    expect(failed).toMatchObject({ status: 'failed', retry: false });
    expect(JSON.stringify(failed)).toContain('did not make exactly one wheel');
    expect(await exists(workOf())).toBe(false);
  });
});

describe('the wheel that was built', () => {
  const refused: [string, () => void, string][] = [
    ['lists a dependency it will not install', () => { behaviour.wheel = wheelBytes({ requires: ['evil @ git+https://evil.example/evil.git'] }); }, 'lists a requirement Archipelia will not install'],
    ['holds another package', () => { behaviour.wheel = wheelBytes({ modules: ['someotherthing'] }); }, 'does not contain the package ctrando'],
    ['does not fit the engine', () => { behaviour.tags = ['cp313-cp313-win_amd64']; }, 'does not fit this engine'],
  ];

  test.each(refused)('is refused when it %s, and nothing is cached', async (_label, arrange, message) => {
    arrange();
    const { prepared, requestOf, builds } = bed();
    const failed = await builds.build(requestOf(await prepared()));
    expect(failed).toMatchObject({ status: 'failed' });
    expect(JSON.stringify(failed)).toContain(message);
    expect(await registered.cached()).toEqual([]);
  });
});
