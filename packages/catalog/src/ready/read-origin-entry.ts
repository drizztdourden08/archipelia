/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { CatalogEntry, DataFiles, WorldOrigin } from '@archipelia/model';
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from '../first-party/first-party.constants';
import { readReleaseAsset } from '../first-party/read-release-asset';
import { releaseUrl } from '../first-party/release-url';
import { withPrerelease } from '../first-party/with-prerelease';
import type { ReleasesRead } from '../versions/versions.type';
import { readPrereleaseManifest } from './read-prerelease-manifest';
import { readReadyCache } from './read-ready-cache';
import { readyEntry } from './ready-entry';
import { sameName } from './same-name';
import { stateOfManifest } from './state-of-manifest';

const readOriginEntry = async (
  cache: DataFiles,
  origin: WorldOrigin,
  request: typeof fetch,
  readReleases: (repo: string) => Promise<ReleasesRead>,
): Promise<CatalogEntry | undefined> => {
  const listed = (await readReadyCache(cache))?.repos.find((repo) => repo.id === origin.repoId && sameName(repo.fullName, origin.repo));
  if (!listed) return undefined;
  const latest = await readReleaseAsset(releaseUrl(listed.fullName, STANDARD_MANIFEST), request, MAX_MANIFEST_BYTES);
  const found = isRecord(latest) ? undefined : await readPrereleaseManifest(readReleases, request, listed.fullName);
  const entry = readyEntry(listed, stateOfManifest(isRecord(latest) ? latest : (found?.manifest ?? null)), found?.tag);
  return entry && withPrerelease(entry, found?.tag);
};

export { readOriginEntry };
