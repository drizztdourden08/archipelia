/* @layer core @kind logic */
import type { PythonRange } from '@archipelia/model';
import { parsePythonRange } from './parse-python-range';
import type { RangeInput } from './resolve-python-range.type';
import { versionInRange } from './version-in-range';

const resolvePythonRange = ({ moduleUpdate, platform, ap, defaults }: RangeInput): PythonRange => {
  const declared = moduleUpdate === undefined ? undefined : parsePythonRange(moduleUpdate, platform);
  if (!declared) return { ...defaults.fallbackRange, source: 'defaults' };
  if (declared.maxExclusive) return declared;
  const ceiling = defaults.pythonCeilings.find((entry) => versionInRange(ap, entry.ap));
  if (ceiling) return { ...declared, maxExclusive: ceiling.maxExclusive, source: 'defaults' };
  return { ...declared, source: 'unknown' };
};

export { resolvePythonRange };
