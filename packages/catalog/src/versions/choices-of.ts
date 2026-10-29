/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { defaultRelease } from '../first-party/default-release';
import { releaseVersion } from '../first-party/release-version';
import { GithubLimitError } from '../source/github-limit-error';
import type { Checked, ReleaseSummary, VersionChoice, VersionList } from './versions.type';

const choiceOf = (release: ReleaseSummary, check: Checked | undefined, version: string | undefined): VersionChoice => ({
  id: release.tag,
  label: release.tag,
  prerelease: release.prerelease,
  ...(release.publishedAt ? { publishedAt: release.publishedAt } : {}),
  ...(version ? { version } : {}),
  ...(check?.reason ? { reason: check.reason } : {}),
});

const choicesOf = (entry: CatalogEntry, releases: ReleaseSummary[], checks: Checked[], limitedUntil: number | undefined): VersionList => {
  const target = defaultRelease(releases);
  const onlyPrereleases = target?.prerelease === true;
  const at = target ? releases.indexOf(target) : -1;
  const choices = releases.map((release, index) => choiceOf(release, checks[index], checks[index]?.version ?? (index === at ? releaseVersion(entry) : undefined)));
  const open = choices.find((choice) => (onlyPrereleases || !choice.prerelease) && !choice.reason);
  const latest = choices[at];
  return {
    by: 'tag',
    choices,
    ...(open ? { defaultId: open.id } : {}),
    ...(latest ? { latestId: latest.id } : {}),
    ...(limitedUntil === undefined ? {} : { problem: new GithubLimitError(limitedUntil).message }),
  };
};

export { choicesOf };
