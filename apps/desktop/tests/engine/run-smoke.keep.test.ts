/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { runSmoke } from '../../electron/engine/smoke/run-smoke';
import type { SmokeDeps } from '../../electron/engine/smoke/smoke.type';
import { runtimeOf } from './install-fakes';

const fakeSmoke = () => {
  const remove = vi.fn(() => Promise.resolve());
  const deps = {
    placeWorld: vi.fn(() => Promise.resolve({ game: 'ChecksFinder', remove })),
    readSchemas: vi.fn((_runtime: unknown, games: string[]) => Promise.resolve({ loaded: games.filter((game) => game !== 'Broken'), errors: {} })),
    generateSeed: vi.fn(() => Promise.resolve({ seedFile: '/engines/new/smoke/output/seed.zip', warnings: ['progress may be coarse'] })),
    hostSeed: vi.fn(() => Promise.resolve()),
    clearWork: vi.fn(() => Promise.resolve()),
    now: () => 42,
  } satisfies SmokeDeps;
  return { deps, remove };
};

const inputOf = (carried: string[] = [], signal = new AbortController().signal) => ({ runtime: runtimeOf('new'), carried, signal, log: () => undefined });

describe('the smoke check', () => {
  test('reads the options, makes a seed and hosts it, then cleans up', async () => {
    const { deps, remove } = fakeSmoke();
    const outcome = await runSmoke(deps, inputOf(['Alpha', 'Broken']));
    expect(outcome).toEqual({ result: { ok: true, at: 42, warnings: ['progress may be coarse'] }, broken: ['Broken'] });
    expect(deps.readSchemas).toHaveBeenCalledWith(expect.anything(), ['ChecksFinder', 'Alpha', 'Broken']);
    expect(deps.hostSeed).toHaveBeenCalledWith(expect.objectContaining({ seedFile: '/engines/new/smoke/output/seed.zip' }));
    expect(deps.clearWork).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });

  test('a test game that does not load fails the options check', async () => {
    const { deps } = fakeSmoke();
    deps.readSchemas.mockImplementation(() => Promise.resolve({ loaded: [], errors: { ChecksFinder: 'ModuleNotFoundError' } }));
    const outcome = await runSmoke(deps, inputOf());
    expect(outcome.result).toMatchObject({ ok: false, failed: 'schema' });
    expect(outcome.error).toBe('ModuleNotFoundError');
    expect(deps.generateSeed).not.toHaveBeenCalled();
  });

  test('no test game in the engine fails the options check', async () => {
    const { deps } = fakeSmoke();
    deps.placeWorld.mockImplementation(() => Promise.reject(new Error('no test game')));
    expect((await runSmoke(deps, inputOf())).result.failed).toBe('schema');
  });

  test('a seed that is not made fails the seed check and keeps the work folder', async () => {
    const { deps, remove } = fakeSmoke();
    deps.generateSeed.mockImplementation(() => Promise.reject(new Error('Generate made no seed')));
    const outcome = await runSmoke(deps, inputOf());
    expect(outcome).toMatchObject({ result: { ok: false, failed: 'generate' }, error: 'Generate made no seed' });
    expect(deps.hostSeed).not.toHaveBeenCalled();
    expect(deps.clearWork).not.toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });

  test('a server that never hosts fails the server check', async () => {
    const { deps } = fakeSmoke();
    deps.hostSeed.mockImplementation(() => Promise.reject(new Error('MultiServer did not say it was hosting within 60 s.')));
    expect((await runSmoke(deps, inputOf())).result.failed).toBe('host');
  });

  test('a cancel is not a failed check', async () => {
    const { deps } = fakeSmoke();
    const controller = new AbortController();
    deps.generateSeed.mockImplementation(() => {
      controller.abort();
      return Promise.reject(new Error('killed'));
    });
    await expect(runSmoke(deps, inputOf([], controller.signal))).rejects.toThrow();
  });
});
