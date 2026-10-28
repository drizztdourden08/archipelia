/* @layer core @kind logic */
import { releaseUrl } from '../first-party/release-url';
import type { GithubRepo } from './enrich.type';
import { RELEASE_HOSTS } from './enrich.constants';
import { githubFetch } from './github-fetch';
import { readCapped } from './read-capped';

const isTrusted = (finalUrl: string): boolean => {
  if (finalUrl === '') return true;
  return URL.canParse(finalUrl) && new URL(finalUrl).protocol === 'https:' && RELEASE_HOSTS.test(new URL(finalUrl).hostname);
};

const fetchReleaseFile = async (fetchFn: typeof fetch, { owner, repo }: GithubRepo, name: string, max: number): Promise<Uint8Array | undefined> => {
  const res = await githubFetch(fetchFn, releaseUrl(`${owner}/${repo}`, name));
  if (!res.ok || !isTrusted(res.url)) {
    await res.body?.cancel();
    return undefined;
  }
  return readCapped(res, max);
};

export { fetchReleaseFile };
