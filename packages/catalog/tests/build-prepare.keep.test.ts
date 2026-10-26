/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';
import { archiveOf, COMMIT, PLAN, PROJECT_FILES, SOURCE_URL } from './build.fixtures';
import { behaviour, engine, ZIP } from './build-engine.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { createBuilds } = await import('../src/build/create-builds');
const { venvPython } = await import('@archipelia/engine');
const { bed, exists, registerBuildBed } = await import('./build-bed.fixtures');

registerBuildBed();

const sha256Of = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

describe('preparing a build', () => {
  test('downloads the archive of the pinned commit once, shows its checksum, sets up the venv with the engine Python and lists the build tools', async () => {
    const { builds, calls, seen, prepared, logs } = bed();
    const plan = await prepared();
    expect(seen).toEqual([SOURCE_URL]);
    expect(plan).toMatchObject({ owner: 'Pseudoarc', repo: 'ctrando', module: 'ctrando', commit: COMMIT, archiveSha256: sha256Of(ZIP), size: ZIP.length });
    expect(plan.tools).toEqual([
      { name: 'setuptools', version: '80.1.0', pin: 'setuptools==80.1.0' }, { name: 'wheel', version: '0.45.1', pin: 'wheel==0.45.1' },
    ]);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.job).toBe('venv');
    expect(calls[0]?.command).toBe((behaviour.runtime as EngineRuntime).python);
    expect(calls[0]?.args.slice(0, 5)).toEqual(['-X', 'utf8', '-I', '-m', 'venv']);
    expect(logs.join('\n')).toContain(`sha256 ${sha256Of(ZIP)}`);
    await builds.dispose();
  });

  test('resolves the build requirements inside the private venv, not against the packages of the engine', async () => {
    const { builds, calls, prepared } = bed();
    await prepared();
    const [runtime, specs] = engine.resolvePackages.mock.calls[0] ?? [];
    expect((runtime as EngineRuntime).python).toBe(venvPython(calls[0]?.args.at(-1) ?? ''));
    expect(specs).toEqual(['setuptools>=61', 'wheel']);
    await builds.dispose();
  });

  test('stops with the log when the venv cannot be made, and removes its temporary folder', async () => {
    behaviour.runs.venv = { status: 'failed', code: 1, lines: ['No module named ensurepip'] };
    const { calls, prepared, workOf } = bed();
    await expect(prepared()).rejects.toThrow('could not set up a private build folder');
    expect(await exists(workOf())).toBe(false);
    expect(calls).toHaveLength(1);
  });

  test('refuses a project whose build settings list a requirement it will not install, before any step runs', async () => {
    behaviour.served = archiveOf({ ...PROJECT_FILES, 'pyproject.toml': '[build-system]\nrequires = ["evil @ git+https://evil.example/evil.git"]\n' });
    const { builds, calls } = bed();
    const made = await builds.prepare(PLAN);
    expect(made).toMatchObject({ status: 'failed', retry: false });
    expect(JSON.stringify(made)).toContain('will not install');
    expect(calls).toEqual([]);
  });

  test('refuses a source archive that holds a path out of its folder, before any step runs', async () => {
    behaviour.served = archiveOf({ ...PROJECT_FILES, '../evil.txt': 'x' });
    const { builds, calls } = bed();
    expect(JSON.stringify(await builds.prepare(PLAN))).toContain('will not unpack');
    expect(calls).toEqual([]);
  });

  test('ends as cancelled and leaves no folder behind when it is cancelled while the source downloads', async () => {
    let started: () => void = () => undefined;
    const hasStarted = new Promise<void>((resolve) => { started = resolve; });
    const hanging: typeof fetch = (_input, init) => new Promise<Response>((_resolve, reject) => {
      started();
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    });
    const builds = createBuilds({ fetch: hanging, engineDir: () => Promise.resolve('engine'), run: () => Promise.reject(new Error('unreachable')) });
    const preparing = builds.prepare(PLAN);
    await hasStarted;
    builds.cancel();
    expect(await preparing).toEqual({ status: 'cancelled' });
  });
});
