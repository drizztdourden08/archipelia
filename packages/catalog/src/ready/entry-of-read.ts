/* @layer core @kind logic */
import type { AssetRead } from '../first-party/read-conditional-asset.type';
import type { ManifestEntry } from './manifest-cache.type';
import type { ReadyRepo } from './ready.type';

const entryOfRead = (got: AssetRead, repo: ReadyRepo, same: ManifestEntry | undefined, now: number): ManifestEntry => {
  if (got.kind === 'same' && same) return { ...same, fetchedAt: now };
  if (got.kind === 'found') return { repo: repo.fullName, fetchedAt: now, manifest: got.value, ...(got.etag ? { etag: got.etag } : {}) };
  return { repo: repo.fullName, fetchedAt: now, manifest: null };
};

export { entryOfRead };
