/* @layer core @kind logic */
import { githubFetch } from '../enrich/github-fetch';
import type { GithubRepo } from '../enrich/enrich.type';
import { MAX_README_BYTES, RAW_HOST } from '../enrich/enrich.constants';
import { readCapped } from '../enrich/read-capped';
import { GithubLimitError } from './github-limit-error';
import { limitOf } from './limit-of';
import { API_HEADERS, CACHE_MS, GITHUB_API } from './source.constants';
import type { CacheEntry, GithubClient, GithubClientDeps } from './source.type';

const cached = <T,>(store: Map<string, CacheEntry<T>>, key: string, now: number, load: () => Promise<T>): Promise<T> => {
  const hit = store.get(key);
  if (hit && now - hit.at < CACHE_MS) return hit.value;
  const value = load();
  store.set(key, { at: now, value });
  value.catch(() => { store.delete(key); });
  return value;
};

const createGithubClient = ({ fetch: request = fetch, now = Date.now }: GithubClientDeps = {}): GithubClient => {
  const apiStore = new Map<string, CacheEntry<unknown>>();
  const rawStore = new Map<string, CacheEntry<string | undefined>>();
  const blocked = new Map<string, number>();

  const loadApi = async (path: string): Promise<unknown> => {
    const bucket = path.startsWith('/search') ? 'search' : 'core';
    const until = blocked.get(bucket);
    if (until !== undefined && until > now()) throw new GithubLimitError(until);
    const res = await githubFetch(request, `${GITHUB_API}${path}`, API_HEADERS);
    const limit = limitOf(res, now());
    if (limit !== undefined) {
      blocked.set(bucket, limit);
      await res.body?.cancel();
      throw new GithubLimitError(limit);
    }
    if (res.status === 404) {
      await res.body?.cancel();
      return undefined;
    }
    if (!res.ok) {
      await res.body?.cancel();
      throw new Error(`GitHub answered ${res.status}.`);
    }
    const body: unknown = await res.json();
    return body;
  };

  const loadRaw = async ({ owner, repo }: GithubRepo, rev: string, file: string): Promise<string | undefined> => {
    const res = await githubFetch(request, `${RAW_HOST}/${owner}/${repo}/${encodeURIComponent(rev)}/${file}`).catch(() => undefined);
    if (!res?.ok) {
      await res?.body?.cancel();
      return undefined;
    }
    const bytes = await readCapped(res, MAX_README_BYTES);
    return bytes ? new TextDecoder().decode(bytes) : undefined;
  };

  return {
    api: (path) => cached(apiStore, path, now(), () => loadApi(path)),
    raw: (repo, rev, file) => cached(rawStore, `${repo.owner}/${repo.repo}@${rev}:${file}`, now(), () => loadRaw(repo, rev, file)),
  };
};

export { createGithubClient };
