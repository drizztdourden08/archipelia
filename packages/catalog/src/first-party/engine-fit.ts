/* @layer core @kind logic */
import { compareVersions } from '@archipelia/engine';
import type { FirstPartyRelease } from '@archipelia/model';

const engineFit = ({ minimumAp, maximumAp }: FirstPartyRelease, apVersion: string): string | undefined => {
  if (minimumAp && compareVersions(apVersion, minimumAp) < 0) {
    return `Needs Archipelago ${minimumAp} or newer, the active engine is ${apVersion}`;
  }
  if (maximumAp && compareVersions(apVersion, maximumAp) > 0) {
    return `Needs Archipelago ${maximumAp} or older, the active engine is ${apVersion}`;
  }
  return undefined;
};

export { engineFit };
