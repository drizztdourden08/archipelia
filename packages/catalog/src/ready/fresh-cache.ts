/* @layer core @kind logic */
import { EMPTY_CACHE } from './ready.constants';
import type { ReadyCache, ReadyResult } from './ready.type';

const freshCache = (got: ReadyResult, stored: ReadyCache | null, at: number): ReadyCache => {
  if (got.kind === 'same') return { ...(stored ?? EMPTY_CACHE), fetchedAt: at };
  return { fetchedAt: at, total: got.total, fetched: got.fetched, repos: got.repos, ...(got.etag ? { etag: got.etag } : {}) };
};

export { freshCache };
