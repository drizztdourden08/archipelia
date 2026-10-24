/* @layer client-kit @kind logic */
import type { WorldFit, WorldRange } from './world-fit.type';
import { compareApVersions } from './compare-ap-versions';
import { parseApVersion } from './parse-ap-version';

const nameOf = ({ game, worldVersion }: WorldRange): string =>
  [game ?? 'This world', worldVersion].filter((part) => part !== undefined).join(' ');

const describeRange = ({ minimumAp, maximumAp }: WorldRange): string => {
  if (minimumAp !== undefined && maximumAp !== undefined) return `Archipelago ${minimumAp} to ${maximumAp}`;
  if (minimumAp !== undefined) return `Archipelago ${minimumAp} and newer`;
  if (maximumAp !== undefined) return `Archipelago ${maximumAp} and older`;
  return 'any Archipelago version';
};

const checkWorldFit = (range: WorldRange, archipelagoVersion: string): WorldFit => {
  const bounds = [range.minimumAp, range.maximumAp].filter((bound) => bound !== undefined);
  const invalid = [archipelagoVersion, ...bounds].find((version) => parseApVersion(version) === null);
  if (invalid !== undefined) {
    return { fits: false, reason: 'invalid-version', message: `"${invalid}" is not an Archipelago version such as 0.6.8.` };
  }
  const tooOld = range.minimumAp !== undefined && compareApVersions(archipelagoVersion, range.minimumAp) < 0;
  const tooNew = range.maximumAp !== undefined && compareApVersions(archipelagoVersion, range.maximumAp) > 0;
  if (!tooOld && !tooNew) return { fits: true };
  return {
    fits: false,
    reason: tooOld ? 'too-old' : 'too-new',
    message: `${nameOf(range)} supports ${describeRange(range)}, not Archipelago ${archipelagoVersion}.`,
  };
};

export { checkWorldFit };
