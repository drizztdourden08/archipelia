/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from '../first-party/first-party.constants';
import { prereleaseTag } from '../first-party/prerelease-tag';
import { readReleaseAsset } from '../first-party/read-release-asset';
import { releaseUrl } from '../first-party/release-url';
import type { ReleasesRead } from '../versions/versions.type';
import type { PrereleaseManifest } from './manifest-cache.type';

const readPrereleaseManifest = async (
  readReleases: (repo: string) => Promise<ReleasesRead>,
  request: typeof fetch,
  repo: string,
): Promise<PrereleaseManifest | undefined> => {
  const tag = await prereleaseTag(readReleases, repo);
  if (tag === undefined) return undefined;
  const manifest = await readReleaseAsset(releaseUrl(repo, STANDARD_MANIFEST, tag), request, MAX_MANIFEST_BYTES);
  return isRecord(manifest) ? { manifest, tag } : undefined;
};

export { readPrereleaseManifest };
