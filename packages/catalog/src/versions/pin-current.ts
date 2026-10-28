/* @layer core @kind logic */
import { releaseVersion } from '../first-party/release-version';
import { latestRelease } from './latest-release';
import type { ReleaseListDeps } from './list-release-versions.type';
import { pinRelease } from './pin-release';
import type { Pinned, VersionsParams } from './versions.type';

const pinCurrent = async (deps: ReleaseListDeps, params: VersionsParams): Promise<Pinned | undefined> => {
  const release = await latestRelease(deps, params.entry);
  if (!release) return undefined;
  const pinned = await pinRelease(deps, { ...params, tag: release.tag }).catch(() => undefined);
  return pinned && pinned.version === releaseVersion(params.entry) ? pinned : undefined;
};

export { pinCurrent };
