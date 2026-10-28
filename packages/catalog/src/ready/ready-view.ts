/* @layer core @kind logic */
import { EMPTY_CACHE } from './ready.constants';
import type { ReadyCache, ReadySearch } from './ready.type';

const readyView = (stored: ReadyCache | null, problems: string[] = [], limitedUntil?: number): ReadySearch => {
  const { repos, total, fetched, fetchedAt } = stored ?? EMPTY_CACHE;
  return { repos, total, fetched, fetchedAt, problems, ...(limitedUntil === undefined ? {} : { limitedUntil }) };
};

export { readyView };
