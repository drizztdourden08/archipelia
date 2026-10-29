/* @layer core @kind logic */
import { FEED_TIMEOUT_MS, GITHUB_JSON, MAX_RELEASE_PAGES, RELEASES_URL } from './feed-sources.constants';
import type { FetchLike } from './fetch-like.type';
import type { ReleasesOutcome } from './fetch-releases.type';
import { nextLink } from './next-link';
import { parseReleases } from './parse-releases';
import { requireOk } from './require-ok';

const fetchReleases = async (fetchUrl: FetchLike, etag?: string): Promise<ReleasesOutcome> => {
  const items: unknown[] = [];
  let url: string | undefined = RELEASES_URL;
  let newEtag: string | undefined;
  for (let page = 0; url && page < MAX_RELEASE_PAGES; page += 1) {
    const headers: Record<string, string> = { accept: GITHUB_JSON };
    if (page === 0 && etag) headers['if-none-match'] = etag;
    const res = await fetchUrl(url, { headers, signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
    if (page === 0 && res.status === 304) return { kind: 'not-modified' };
    requireOk(res, 'Archipelago releases');
    if (page === 0) newEtag = res.headers.get('etag') ?? undefined;
    const body = await res.json();
    if (Array.isArray(body)) items.push(...(body as unknown[]));
    url = nextLink(res.headers.get('link'));
  }
  return { kind: 'ok', releases: parseReleases(items), etag: newEtag };
};

export { fetchReleases };
