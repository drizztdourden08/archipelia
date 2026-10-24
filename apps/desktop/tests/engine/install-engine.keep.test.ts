/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { EngineChoice } from '@archipelia/model';
import { fallbackChoice } from '../../electron/engine/fallback-choice';
import { installEngine } from '../../electron/engine/install-engine';
import { fakeInstall, passed, pickedChoice, runtimeOf, testedChoice } from './install-fakes';

describe('the install job', () => {
  test('a passing install carries the worlds, tests the engine and switches to it', async () => {
    const { deps, job, guard } = fakeInstall();
    const result = await installEngine(deps, pickedChoice);
    expect(result).toEqual({ outcome: 'switched', id: 'new' });
    expect(deps.smoke).toHaveBeenCalledWith(expect.objectContaining({ carried: ['Alpha', 'Beta'] }));
    expect(deps.carry).toHaveBeenNthCalledWith(1, expect.objectContaining({ since: 0 }));
    expect(deps.carry).toHaveBeenNthCalledWith(2, expect.objectContaining({ since: 5 }));
    expect(deps.register).toHaveBeenCalledWith(expect.objectContaining({ id: 'new', state: 'ready' }));
    expect(deps.activate).toHaveBeenCalledWith('new');
    expect(guard.restore).not.toHaveBeenCalled();
    expect(job.done).toHaveBeenCalled();
    expect(job.step.mock.calls.map((call: unknown[]) => call[0])).toEqual(['resolve', 'worlds', 'smoke', 'switch']);
  });

  test('a failed smoke check keeps the engine in use and names the check', async () => {
    const { deps, job, guard } = fakeInstall();
    deps.smoke.mockImplementation(() => Promise.resolve(passed({ result: { ok: false, at: 1, failed: 'host', warnings: [] }, error: 'port busy' })));
    const result = await installEngine(deps, pickedChoice);
    expect(result).toEqual({ outcome: 'failed', id: 'new', failed: 'host', error: 'The test server failed: port busy', fallback: testedChoice });
    expect(deps.activate).not.toHaveBeenCalled();
    expect(deps.register).toHaveBeenCalledWith(expect.objectContaining({ id: 'new', state: 'failed' }));
    expect(deps.discard).not.toHaveBeenCalled();
    expect(guard.restore).toHaveBeenCalled();
    expect(job.fail).toHaveBeenCalled();
  });

  test('worlds that do not load stop the job before the switch', async () => {
    const { deps, job, guard } = fakeInstall();
    deps.carry.mockImplementation(() => Promise.resolve({ copied: ['alpha'], reinstalled: [], problems: [{ apworld: 'beta', game: 'Beta', reason: 'import error' }], at: 5 }));
    deps.smoke.mockImplementation(() => Promise.resolve(passed({ broken: ['Alpha'] })));
    const result = await installEngine(deps, pickedChoice);
    expect(result).toEqual({ outcome: 'ready', id: 'new', brokenWorlds: ['Beta', 'Alpha'] });
    expect(deps.activate).not.toHaveBeenCalled();
    expect(deps.register).toHaveBeenCalledWith(expect.objectContaining({ state: 'ready' }));
    expect(guard.restore).toHaveBeenCalled();
    expect(job.skip).toHaveBeenCalledWith('switch');
  });

});

describe('an install that stops early', () => {
  test('a cancel removes the half built folder and reports cancelled', async () => {
    const { deps, controller } = fakeInstall();
    deps.build.mockImplementation(() => {
      controller.abort();
      return Promise.reject(new Error('aborted'));
    });
    expect(await installEngine(deps, pickedChoice)).toEqual({ outcome: 'cancelled', id: 'new' });
    expect(deps.discard).toHaveBeenCalledWith('new');
    expect(deps.activate).not.toHaveBeenCalled();
  });

  test('a failed download removes the new folder and offers the tested version', async () => {
    const { deps } = fakeInstall();
    deps.build.mockImplementation(() => Promise.reject(new Error('HTTP 404')));
    const result = await installEngine(deps, pickedChoice);
    expect(result).toEqual({ outcome: 'failed', id: 'new', error: 'HTTP 404', fallback: testedChoice });
    expect(deps.discard).toHaveBeenCalledWith('new');
  });

  test('a folder that was built before is kept when the job fails', async () => {
    const { deps } = fakeInstall();
    deps.wasBuilt.mockImplementation(() => Promise.resolve(true));
    deps.build.mockImplementation(() => Promise.reject(new Error('pip failed')));
    await installEngine(deps, pickedChoice);
    expect(deps.discard).not.toHaveBeenCalled();
  });

});

describe('the switch at the end of an install', () => {
  test('a switch that fails puts the game records back and keeps the tested engine', async () => {
    const { deps, guard } = fakeInstall();
    deps.activate.mockImplementation(() => Promise.reject(new Error('disk full')));
    const result = await installEngine(deps, pickedChoice);
    expect(result.outcome).toBe('failed');
    expect(guard.restore).toHaveBeenCalled();
    expect(deps.discard).not.toHaveBeenCalled();
  });

  test('the first install has no worlds to carry', async () => {
    const { deps, job } = fakeInstall();
    deps.active.mockImplementation(() => Promise.resolve(undefined));
    expect(await installEngine(deps, pickedChoice)).toEqual({ outcome: 'switched', id: 'new' });
    expect(deps.carry).not.toHaveBeenCalled();
    expect(job.skip).toHaveBeenCalledWith('worlds');
    expect(deps.activate).toHaveBeenCalledWith('new');
  });

  test('a rebuild of the engine in use that fails its test stays the engine in use', async () => {
    const { deps } = fakeInstall();
    deps.smoke.mockImplementation(() => Promise.resolve(passed({ result: { ok: false, at: 1, failed: 'generate', warnings: [] }, error: 'no seed' })));
    deps.active.mockImplementation(() => Promise.resolve(runtimeOf('new')));
    const result = await installEngine(deps, pickedChoice);
    expect(result.failed).toBe('generate');
    expect(deps.register).not.toHaveBeenCalled();
    expect(deps.carry).not.toHaveBeenCalled();
  });
});

describe('the tested version offered after a failure', () => {
  const engineOf = (choice: EngineChoice) => ({
    id: 'x', ap: choice.ap, apCommit: '', python: choice.python, pythonRelease: choice.pythonRelease, target: 'win32-x64', builtAt: 0, state: 'ready' as const,
  });

  test('is the pinned default on a first run', () => {
    expect(fallbackChoice(pickedChoice, undefined, 'win32-x64')).toEqual(testedChoice);
  });

  test('is not offered when the failed choice was the default', () => {
    expect(fallbackChoice(testedChoice, undefined, 'win32-x64')).toBeUndefined();
  });

  test('is not offered when the default is already the engine in use', () => {
    expect(fallbackChoice(pickedChoice, engineOf(testedChoice), 'win32-x64')).toBeUndefined();
  });
});
