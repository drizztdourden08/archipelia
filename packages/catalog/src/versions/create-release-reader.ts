/* @layer core @kind logic */
import { FULL_NAME } from '../ready/ready.constants';
import { GithubLimitError } from '../source/github-limit-error';
import { CACHE_MS } from '../source/source.constants';
import { fetchReleases } from './fetch-releases';
import { readStoredReleases } from './read-stored-releases';
import type { Hit } from './create-release-reader.type';
import type { ReleasesRead, StoredReleases, VersionsDeps } from './versions.type';
import { writeStoredReleases } from './write-stored-releases';

const createReleaseReader = ({ files, fetch: request = fetch, now = Date.now }: VersionsDeps) => {
  const memory = new Map<string, Hit>();
  let blockedUntil = 0;

  const fresh = async (repo: string, key: string, stored: StoredReleases | undefined): Promise<ReleasesRead> => {
    if (blockedUntil > now()) throw new GithubLimitError(blockedUntil);
    const got = await fetchReleases(request, repo, now(), stored?.etag);
    const next: StoredReleases = got
      ? { fetchedAt: now(), releases: got.releases, ...(got.etag ? { etag: got.etag } : {}) }
      : { releases: [], ...stored, fetchedAt: now() };
    await writeStoredReleases(files, key, next);
    return { releases: next.releases };
  };

  const load = async (repo: string, key: string): Promise<ReleasesRead> => {
    const stored = (await readStoredReleases(files))[key];
    try {
      return await fresh(repo, key, stored);
    } catch (error) {
      if (error instanceof GithubLimitError) blockedUntil = error.resetAt;
      if (!stored) throw error;
      return { releases: stored.releases, ...(error instanceof GithubLimitError ? { limitedUntil: error.resetAt } : {}) };
    }
  };

  return (repo: string): Promise<ReleasesRead> => {
    if (!FULL_NAME.test(repo)) return Promise.reject(new Error(`${repo} is not a GitHub repository`));
    const key = repo.toLowerCase();
    const hit = memory.get(key);
    if (hit && now() - hit.at < CACHE_MS) return hit.read;
    const read = load(repo, key);
    memory.set(key, { at: now(), read });
    read.then((done) => { if (done.limitedUntil !== undefined) memory.delete(key); }, () => { memory.delete(key); });
    return read;
  };
};

export { createReleaseReader };
