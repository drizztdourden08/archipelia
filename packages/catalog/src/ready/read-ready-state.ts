/* @layer core @kind logic */
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from '../first-party/first-party.constants';
import { readConditionalAsset } from '../first-party/read-conditional-asset';
import { releaseUrl } from '../first-party/release-url';
import { entryOfRead } from './entry-of-read';
import { isCurrent } from './is-current';
import type { ManifestEntry, ManifestParams, ManifestRead } from './manifest-cache.type';
import { readPrereleaseManifest } from './read-prerelease-manifest';
import type { ReadyRepo } from './ready.type';
import { stateOfManifest } from './state-of-manifest';

const readOf = (entry: ManifestEntry): ManifestRead => ({ entry, state: stateOfManifest(entry.manifest) });

const failedRead = (same: ManifestEntry | undefined, error: unknown): ManifestRead =>
  (same ? readOf(same) : { state: { kind: 'failed', message: error instanceof Error ? error.message : String(error) } });

const tagged = async (entry: ManifestEntry, { request, readReleases }: ManifestParams): Promise<ManifestEntry> => {
  if (entry.manifest !== null) return entry;
  const found = await readPrereleaseManifest(readReleases, request, entry.repo);
  return found ? { ...entry, ...found } : entry;
};

const readReadyState = async (repo: ReadyRepo, old: ManifestEntry | undefined, params: ManifestParams): Promise<ManifestRead> => {
  const { request, now, force } = params;
  const same = old?.repo === repo.fullName ? old : undefined;
  if (same && isCurrent(same.fetchedAt, now, force)) return readOf(same);
  try {
    const got = await readConditionalAsset(releaseUrl(repo.fullName, STANDARD_MANIFEST), request, { etag: same?.etag, max: MAX_MANIFEST_BYTES });
    return readOf(await tagged(entryOfRead(got, repo, same, now), params));
  } catch (error) {
    return failedRead(same, error);
  }
};

export { readReadyState };
