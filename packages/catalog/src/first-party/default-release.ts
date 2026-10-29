/* @layer core @kind logic */
import type { ReleaseSummary } from '../versions/versions.type';

const defaultRelease = (releases: ReleaseSummary[]): ReleaseSummary | undefined => releases.find((release) => !release.prerelease) ?? releases[0];

export { defaultRelease };
