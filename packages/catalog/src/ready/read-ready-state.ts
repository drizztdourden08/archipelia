/* @layer core @kind logic */
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from '../first-party/first-party.constants';
import { readConditionalAsset } from '../first-party/read-conditional-asset';
import { releaseUrl } from '../first-party/release-url';
import { entryOfRead } from './entry-of-read';
import { isCurrent } from './is-current';
import type { ManifestEntry, ManifestParams, ManifestRead } from './manifest-cache.type';
import { readOf } from './read-of';
import type { ReadyRepo } from './ready.type';

const failedRead = (same: ManifestEntry | undefined, error: unknown): ManifestRead =>
  (same ? readOf(same) : { state: { kind: 'failed', message: error instanceof Error ? error.message : String(error) } });

const readReadyState = async (repo: ReadyRepo, old: ManifestEntry | undefined, { request, now, force }: ManifestParams): Promise<ManifestRead> => {
  const same = old?.repo === repo.fullName ? old : undefined;
  if (same && isCurrent(same.fetchedAt, now, force)) return readOf(same);
  try {
    const got = await readConditionalAsset(releaseUrl(repo.fullName, STANDARD_MANIFEST), request, { etag: same?.etag, max: MAX_MANIFEST_BYTES });
    return readOf(entryOfRead(got, repo, same, now));
  } catch (error) {
    return failedRead(same, error);
  }
};

export { readReadyState };
