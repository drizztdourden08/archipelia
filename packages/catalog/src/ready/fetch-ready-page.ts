/* @layer core @kind logic */
import { githubFetch } from '../enrich/github-fetch';
import { GithubLimitError } from '../source/github-limit-error';
import { limitOf } from '../source/limit-of';
import { API_HEADERS } from '../source/source.constants';
import { pageOf } from './page-of';
import { NOT_MODIFIED } from './ready.constants';
import type { ReadyPage } from './ready.type';

const fetchReadyPage = async (request: typeof fetch, url: string, now: number, etag?: string): Promise<ReadyPage | null> => {
  const res = await githubFetch(request, url, { ...API_HEADERS, ...(etag ? { 'if-none-match': etag } : {}) });
  const limit = limitOf(res, now);
  if (limit !== undefined) {
    await res.body?.cancel();
    throw new GithubLimitError(limit);
  }
  if (res.status === NOT_MODIFIED && etag) return null;
  if (!res.ok) {
    await res.body?.cancel();
    throw new Error(`GitHub answered ${res.status}.`);
  }
  return pageOf(res);
};

export { fetchReadyPage };
