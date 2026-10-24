/* @layer core @kind logic */
import type { PythonRange } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import { describePythonRange } from './describe-python-range';
import type { PythonFit } from './python-fit.type';
import { versionLine } from './version-line';

const checkPythonFit = (python: string, range: PythonRange, ap: string, testedLine: string): PythonFit => {
  const outside = compareVersions(python, range.min) < 0 || (range.maxExclusive !== undefined && compareVersions(python, range.maxExclusive) >= 0);
  if (outside) return { fits: false, hint: `Archipelago ${ap} needs ${describePythonRange(range)}` };
  if (range.warnBelow && compareVersions(python, range.warnBelow) < 0) {
    return { fits: true, hint: 'Archipelago warns this Python has security issues' };
  }
  if (range.source === 'unknown' && compareVersions(versionLine(python), testedLine) > 0) {
    return { fits: true, hint: `Archipelago ${ap} does not name a newest Python. ${versionLine(python)} is untested.` };
  }
  return { fits: true };
};

export { checkPythonFit };
