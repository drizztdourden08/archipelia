/* @layer core @kind logic */
import { createReleaseReader } from './create-release-reader';
import { listIndexVersions } from './list-index-versions';
import { listReleaseVersions } from './list-release-versions';
import { pinCurrent } from './pin-current';
import { pinRelease } from './pin-release';
import { repinRelease } from './repin-release';
import type { Pinned, PinnedParams, Repin, RepinParams, VersionList, VersionsDeps, VersionsParams } from './versions.type';

const createVersions = (deps: VersionsDeps) => {
  const releases = { files: deps.files, request: deps.fetch ?? fetch, readReleases: deps.readReleases ?? createReleaseReader(deps) };

  const list = (params: VersionsParams): Promise<VersionList> =>
    (params.entry.firstParty?.repo ? listReleaseVersions(releases, params) : Promise.resolve(listIndexVersions(params)));

  const pin = (params: PinnedParams): Promise<Pinned> => pinRelease(releases, params);

  const current = (params: VersionsParams): Promise<Pinned | undefined> => pinCurrent(releases, params);

  const repin = (params: RepinParams): Promise<Repin> => repinRelease({ list, pin }, params);

  return { current, list, pin, repin };
};

export { createVersions };
