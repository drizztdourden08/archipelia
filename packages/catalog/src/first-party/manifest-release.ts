/* @layer core @kind logic */
import type { ReleaseSummary } from '../versions/versions.type';
import { STANDARD_MANIFEST } from './first-party.constants';

const carries = (release: ReleaseSummary, legacy: string | undefined): boolean =>
  release.assets.some((asset) => asset.name === STANDARD_MANIFEST || asset.name === legacy);

const manifestRelease = (releases: ReleaseSummary[], legacy?: string): ReleaseSummary | undefined => {
  const carrying = releases.filter((release) => carries(release, legacy));
  return carrying.find((release) => !release.prerelease) ?? carrying[0];
};

export { manifestRelease };
