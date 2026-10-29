/* @layer core @kind logic */
import { mapPool } from '../pool';
import type { ManifestRead } from './manifest-cache.type';
import { readOf } from './read-of';
import { readPrereleaseManifest } from './read-prerelease-manifest';
import { MAX_PRERELEASE_CHECKS, READY_CONCURRENCY } from './ready.constants';
import type { PrereleaseParams } from './check-prereleases.type';

const isUnchecked = (read: ManifestRead | undefined): boolean => read?.entry?.manifest === null && read.entry.checked !== true;

const checkOne = async (read: ManifestRead, { request, readReleases }: PrereleaseParams): Promise<ManifestRead> => {
  const entry = read.entry;
  if (!entry) return read;
  try {
    const found = await readPrereleaseManifest(readReleases, request, entry.repo);
    return readOf({ ...entry, checked: true, ...found });
  } catch {
    return read;
  }
};

const checkPrereleases = async (reads: ManifestRead[], params: PrereleaseParams): Promise<ManifestRead[]> => {
  const next = [...reads];
  const picked = params.repos
    .map((repo, at) => ({ repo, at }))
    .filter(({ at }) => isUnchecked(reads[at]))
    .sort((a, b) => b.repo.pushedAt.localeCompare(a.repo.pushedAt))
    .slice(0, MAX_PRERELEASE_CHECKS);
  const done = await mapPool(picked, READY_CONCURRENCY, ({ at }) => checkOne(reads[at] ?? { state: { kind: 'none' } }, params));
  picked.forEach(({ at }, i) => { next[at] = done[i] ?? next[at] ?? { state: { kind: 'none' } }; });
  return next;
};

export { checkPrereleases };
