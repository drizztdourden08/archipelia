/* @layer core @kind logic */
import { createReleaseReader } from './create-release-reader';
import { listIndexVersions } from './list-index-versions';
import { listReleaseVersions } from './list-release-versions';
import { pinRelease } from './pin-release';
import type { Pinned, PinnedParams, VersionList, VersionsDeps, VersionsParams } from './versions.type';

const createVersions = (deps: VersionsDeps) => {
  const releases = { files: deps.files, request: deps.fetch ?? fetch, readReleases: createReleaseReader(deps) };

  const list = (params: VersionsParams): Promise<VersionList> =>
    (params.entry.firstParty?.repo ? listReleaseVersions(releases, params) : Promise.resolve(listIndexVersions(params)));

  const pin = (params: PinnedParams): Promise<Pinned> => pinRelease(releases, params);

  return { list, pin };
};

export { createVersions };
