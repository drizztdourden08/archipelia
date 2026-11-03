/* @layer core @kind logic */
import type { ReleaseSummary } from '../versions/versions.type';
import { manifestRelease } from './manifest-release';

const defaultRelease = (releases: ReleaseSummary[], legacy?: string): ReleaseSummary | undefined =>
  manifestRelease(releases, legacy) ?? releases.find((release) => !release.prerelease) ?? releases[0];

export { defaultRelease };
