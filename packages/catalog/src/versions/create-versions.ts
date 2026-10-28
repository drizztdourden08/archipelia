/* @layer core @kind logic */
import type { CatalogEntry, InstalledRelease } from '@archipelia/model';
import { createReleaseReader } from './create-release-reader';
import { latestRelease } from './latest-release';
import { listIndexVersions } from './list-index-versions';
import { listReleaseVersions } from './list-release-versions';
import { pinRelease } from './pin-release';
import { repinRelease } from './repin-release';
import type { Pinned, PinnedParams, Repin, RepinParams, VersionList, VersionsDeps, VersionsParams } from './versions.type';

const createVersions = (deps: VersionsDeps) => {
  const releases = { files: deps.files, request: deps.fetch ?? fetch, readReleases: createReleaseReader(deps) };

  const list = (params: VersionsParams): Promise<VersionList> =>
    (params.entry.firstParty?.repo ? listReleaseVersions(releases, params) : Promise.resolve(listIndexVersions(params)));

  const pin = (params: PinnedParams): Promise<Pinned> => pinRelease(releases, params);

  const latest = (entry: CatalogEntry): Promise<InstalledRelease | undefined> => latestRelease(releases, entry);

  const repin = (params: RepinParams): Promise<Repin> => repinRelease({ list, pin }, params);

  return { latest, list, pin, repin };
};

export { createVersions };
