/* @layer tests @kind test */
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { keepRunsLoaded } from '../../src/runs/keep-runs-loaded';
import { useRunsStore } from '../../src/stores/useRunsStore';

const { sessionsList, resets } = vi.hoisted(() => ({ sessionsList: vi.fn(), resets: [] as (() => void)[] }));

vi.mock('../../src/ipc/app-api', () => ({ appApi: () => ({ sessionsList }) }));

vi.mock('@drizztdourden08/brock-react', async () => {
  const { create } = await import('zustand');
  type Initializer = Parameters<ReturnType<typeof create<object>>>[0];
  return {
    createSessionStore: (initializer: Initializer) => {
      const store = create<object>()(initializer);
      const initial = store.getInitialState();
      resets.push(() => store.setState(initial, true));
      return store;
    },
    getAppLog: () => ({ log: () => {} }),
  };
});

const resetAllSessionStores = () => resets.forEach((reset) => reset());

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

let stop = () => {};

beforeEach(() => {
  sessionsList.mockReset();
  sessionsList.mockResolvedValue([]);
  resetAllSessionStores();
  stop = keepRunsLoaded();
});

afterEach(() => stop());

test('a new profile resets the runs and they load again as an empty list', async () => {
  await useRunsStore.getState().load();
  expect(useRunsStore.getState().loaded).toBe(true);
  resetAllSessionStores();
  await settle();
  expect(sessionsList).toHaveBeenCalledTimes(2);
  expect(useRunsStore.getState()).toMatchObject({ loaded: true, failed: false, runs: [] });
});

test('a failed load stays failed and is not retried in a loop', async () => {
  sessionsList.mockRejectedValue(new Error('disk gone'));
  await expect(useRunsStore.getState().load()).rejects.toThrow('disk gone');
  await settle();
  expect(useRunsStore.getState()).toMatchObject({ loaded: false, failed: true });
  expect(sessionsList).toHaveBeenCalledTimes(1);
});

test('a reset after a failure clears it and loads again', async () => {
  sessionsList.mockRejectedValueOnce(new Error('disk gone'));
  await expect(useRunsStore.getState().load()).rejects.toThrow('disk gone');
  resetAllSessionStores();
  await settle();
  expect(useRunsStore.getState()).toMatchObject({ loaded: true, failed: false });
});
