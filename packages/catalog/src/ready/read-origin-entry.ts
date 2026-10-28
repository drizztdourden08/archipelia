/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { CatalogEntry, DataFiles, WorldOrigin } from '@archipelia/model';
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from '../first-party/first-party.constants';
import { readReleaseAsset } from '../first-party/read-release-asset';
import { releaseUrl } from '../first-party/release-url';
import { readReadyCache } from './read-ready-cache';
import { readyEntry } from './ready-entry';
import { sameName } from './same-name';
import { stateOfManifest } from './state-of-manifest';

const readOriginEntry = async (cache: DataFiles, origin: WorldOrigin, request: typeof fetch): Promise<CatalogEntry | undefined> => {
  const listed = (await readReadyCache(cache))?.repos.find((repo) => repo.id === origin.repoId && sameName(repo.fullName, origin.repo));
  if (!listed) return undefined;
  const manifest = await readReleaseAsset(releaseUrl(listed.fullName, STANDARD_MANIFEST), request, MAX_MANIFEST_BYTES);
  return readyEntry(listed, stateOfManifest(isRecord(manifest) ? manifest : null));
};

export { readOriginEntry };
