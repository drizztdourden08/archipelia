/* @layer core @kind logic */
import { GithubLimitError } from '../source/github-limit-error';
import { freshCache } from './fresh-cache';
import { readyView } from './ready-view';
import { SEARCH_CACHE_FILE } from './ready.constants';
import type { ReadyCache, ReadySearch, ReadySearchDeps } from './ready.type';
import { searchReady } from './search-ready';

const failedView = (stored: ReadyCache | null, error: unknown): ReadySearch => {
  if (error instanceof GithubLimitError) return readyView(stored, [], error.resetAt);
  return readyView(stored, [`Archipelia ready search: ${error instanceof Error ? error.message : String(error)}`]);
};

const refreshReady = async ({ files, fetch: request = fetch, now = Date.now }: ReadySearchDeps, stored: ReadyCache | null): Promise<ReadySearch> => {
  try {
    const cache = freshCache(await searchReady(request, now(), stored?.etag), stored, now());
    await files.writeJson(SEARCH_CACHE_FILE, cache);
    return readyView(cache);
  } catch (error) {
    return failedView(stored, error);
  }
};

export { refreshReady };
