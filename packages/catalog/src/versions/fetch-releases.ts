/* @layer core @kind logic */
import { githubFetch } from '../enrich/github-fetch';
import { GithubLimitError } from '../source/github-limit-error';
import { limitOf } from '../source/limit-of';
import { API_HEADERS, GITHUB_API } from '../source/source.constants';
import { releaseOfItem } from './release-of-item';
import { NOT_FOUND, NOT_MODIFIED, RELEASES_PER_PAGE } from './versions.constants';
import type { FetchedReleases } from './versions.type';

const refuse = async (res: Response, now: number): Promise<void> => {
  const limit = limitOf(res, now);
  if (limit !== undefined) {
    await res.body?.cancel();
    throw new GithubLimitError(limit);
  }
  if (res.ok || res.status === NOT_MODIFIED || res.status === NOT_FOUND) return;
  await res.body?.cancel();
  throw new Error(`GitHub answered ${res.status}.`);
};

const fetchReleases = async (request: typeof fetch, repo: string, now: number, etag?: string): Promise<FetchedReleases | null> => {
  const url = `${GITHUB_API}/repos/${repo}/releases?per_page=${RELEASES_PER_PAGE}`;
  const res = await githubFetch(request, url, { ...API_HEADERS, ...(etag ? { 'if-none-match': etag } : {}) });
  await refuse(res, now);
  if (res.status === NOT_MODIFIED && etag) return null;
  if (!res.ok) {
    await res.body?.cancel();
    return { releases: [] };
  }
  const body: unknown = await res.json();
  const tag = res.headers.get('etag');
  return { releases: Array.isArray(body) ? (body as unknown[]).flatMap(releaseOfItem) : [], ...(tag ? { etag: tag } : {}) };
};

export { fetchReleases };
