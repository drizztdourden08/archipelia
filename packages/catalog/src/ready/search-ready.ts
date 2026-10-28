/* @layer core @kind logic */
import { fetchReadyPage } from './fetch-ready-page';
import { MAX_PAGES } from './ready.constants';
import type { ReadyRepo, ReadyResult } from './ready.type';
import { repoOfItem } from './repo-of-item';
import { FIRST_URL } from './search-ready.constants';

const searchReady = async (request: typeof fetch, now: number, etag?: string): Promise<ReadyResult> => {
  const first = await fetchReadyPage(request, FIRST_URL, now, etag);
  if (first === null) return { kind: 'same' };
  const repos: ReadyRepo[] = [];
  let fetched = 0;
  let page = first;
  for (let count = 1; ; count += 1) {
    fetched += page.items.length;
    repos.push(...page.items.flatMap(repoOfItem));
    const more = page.next && count < MAX_PAGES ? await fetchReadyPage(request, page.next, now) : null;
    if (more === null) break;
    page = more;
  }
  return { kind: 'found', repos, total: first.total, fetched, ...(first.etag ? { etag: first.etag } : {}) };
};

export { searchReady };
