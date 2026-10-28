/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
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
  const stable = releases.findIndex((release) => !release.prerelease);
  const choices = releases.map((release, at) => choiceOf(release, checks[at], checks[at]?.version ?? (at === stable ? releaseVersion(entry) : undefined)));
  const open = choices.find((choice) => !choice.prerelease && !choice.reason);
  const latest = choices[stable];
  return {
    by: 'tag',
    choices,
    ...(open ? { defaultId: open.id } : {}),
    ...(latest ? { latestId: latest.id } : {}),
    ...(limitedUntil === undefined ? {} : { problem: new GithubLimitError(limitedUntil).message }),
  };
};

export { choicesOf };
