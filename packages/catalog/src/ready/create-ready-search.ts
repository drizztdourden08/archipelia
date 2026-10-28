/* @layer core @kind logic */
import { isCurrent } from './is-current';
import { readReadyCache } from './read-ready-cache';
import { readyView } from './ready-view';
import type { ReadySearch, ReadySearchDeps } from './ready.type';
import { refreshReady } from './refresh-ready';

const createReadySearch = (deps: ReadySearchDeps) => {
  const now = deps.now ?? Date.now;
  let blockedUntil = 0;

  return async (force: boolean): Promise<ReadySearch> => {
    const stored = await readReadyCache(deps.files);
    if (stored && isCurrent(stored.fetchedAt, now(), force)) return readyView(stored);
    if (blockedUntil > now()) return readyView(stored, [], blockedUntil);
    const got = await refreshReady(deps, stored);
    blockedUntil = got.limitedUntil ?? blockedUntil;
    return got;
  };
};

export { createReadySearch };
