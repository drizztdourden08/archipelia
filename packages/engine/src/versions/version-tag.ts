/* @layer core @kind logic */
import type { VersionFeed, VersionTag } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import { versionLine } from './version-line';
import type { ActiveVersions } from './version-tag.type';

const versionTag = (feed: VersionFeed, active: ActiveVersions | undefined): VersionTag => {
  const known = feed.releases.length > 0 || feed.python.some((build) => !build.pinned);
  if (!active || feed.state === 'never' || !known) return 'not-checked';
  const newerAp = feed.releases.some((release) => compareVersions(release.version, active.ap) > 0);
  const newerPython = feed.python.some(
    (build) => !build.pinned && versionLine(build.version) === versionLine(active.python) && compareVersions(build.version, active.python) > 0,
  );
  return newerAp || newerPython ? 'new-version' : 'up-to-date';
};

export { versionTag };
