/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { MAX_MANIFEST_BYTES } from '../first-party/first-party.constants';
import { readReleaseAsset } from '../first-party/read-release-asset';
import { releaseUrl } from '../first-party/release-url';
import { mapPool } from '../pool';
import { manifestKey } from './manifest-key';
import { readManifestStore } from './read-manifest-store';
import { CHECK_CONCURRENCY, MAX_STORED_MANIFESTS, RELEASE_MANIFESTS_FILE } from './versions.constants';
import type { ManifestReads, ManifestStore, ManifestWant, ReadManifestsParams } from './versions.type';

const readOne = async (request: typeof fetch, repo: string, { release, asset }: ManifestWant): Promise<Record<string, unknown> | null | undefined> => {
  try {
    const value = await readReleaseAsset(releaseUrl(repo, asset.name, release.tag), request, MAX_MANIFEST_BYTES);
    return isRecord(value) ? value : null;
  } catch {
    return undefined;
  }
};

const readReleaseManifests = async ({ files, request, repo, wants }: ReadManifestsParams): Promise<ManifestReads> => {
  const stored = await readManifestStore(files);
  const reads: ManifestReads = new Map();
  const missing = wants.filter((want) => {
    const hit = stored[manifestKey(repo, want)];
    if (hit) reads.set(manifestKey(repo, want), hit.manifest);
    return !hit;
  });
  if (missing.length === 0) return reads;
  const got = await mapPool(missing, CHECK_CONCURRENCY, (want) => readOne(request, repo, want));
  const next: ManifestStore = { ...stored };
  missing.forEach((want, at) => {
    const manifest = got[at];
    if (manifest === undefined) return;
    reads.set(manifestKey(repo, want), manifest);
    next[manifestKey(repo, want)] = { manifest };
  });
  await files.writeJson(RELEASE_MANIFESTS_FILE, Object.fromEntries(Object.entries(next).slice(-MAX_STORED_MANIFESTS))).catch(() => undefined);
  return reads;
};

export { readReleaseManifests };
