/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { assertReleaseFits } from './assert-release-fits';
import { buildVersion } from './build-version';
import type { ChosenRelease } from './choose-release.type';
import { noBuildReason } from './no-build-reason';
import { pickBuild } from './pick-build';

const chooseRelease = (entry: CatalogEntry, version: string, apVersion: string): ChosenRelease => {
  const release = entry.firstParty;
  if (release?.builds) {
    const build = pickBuild(release.builds, apVersion);
    if (!build) throw new Error(noBuildReason(entry.displayName, apVersion, release.builds));
    const target = buildVersion(release, build);
    if (target.version !== version) throw new Error(`${entry.apworld} has no version ${version}`);
    return { target, bundleUrl: build.bundleUrl };
  }
  assertReleaseFits(entry, apVersion);
  const target = entry.versions.find((candidate) => candidate.version === version);
  if (!target) throw new Error(`${entry.apworld} has no version ${version}`);
  return release ? { target, bundleUrl: release.bundleUrl } : { target };
};

export { chooseRelease };
