/* @layer tests @kind test */
import { resetAllSessionStores } from '@drizztdourden08/brock-react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { keepRunsLoaded } from '../../src/runs/keep-runs-loaded';
import { useRunsStore } from '../../src/stores/useRunsStore';

const { sessionsList } = vi.hoisted(() => ({ sessionsList: vi.fn() }));

vi.mock('../../src/ipc/app-api', () => ({ appApi: () => ({ sessionsList }) }));

const settle = async () => {
  for (let turn = 0; turn < 20; turn += 1) await Promise.resolve();
};

let stop = () => {};

beforeEach(() => {
  sessionsList.mockReset();
  sessionsList.mockResolvedValue([]);
  resetAllSessionStores();
  stop = keepRunsLoaded();
});

afterEach(() => stop());

test('K3 a new profile resets the runs and they load again as an empty list', { tags: ['critical'] }, async () => {
  await useRunsStore.getState().load();
  expect(useRunsStore.getState().loaded).toBe(true);
  resetAllSessionStores();
  await settle();
  expect(sessionsList).toHaveBeenCalledTimes(2);
  expect(useRunsStore.getState()).toMatchObject({ loaded: true, failed: false, runs: [] });
});

test('K3 a failed load stays failed and is not retried in a loop', { tags: ['critical'] }, async () => {
  sessionsList.mockRejectedValue(new Error('disk gone'));
  await expect(useRunsStore.getState().load()).rejects.toThrow('disk gone');
  await settle();
  expect(useRunsStore.getState()).toMatchObject({ loaded: false, failed: true });
  expect(sessionsList).toHaveBeenCalledTimes(1);
});

test('K3 a reset after a failure clears it and loads again', { tags: ['critical'] }, async () => {
  sessionsList.mockRejectedValueOnce(new Error('disk gone'));
  await expect(useRunsStore.getState().load()).rejects.toThrow('disk gone');
  resetAllSessionStores();
  await settle();
  expect(useRunsStore.getState()).toMatchObject({ loaded: true, failed: false });
});
