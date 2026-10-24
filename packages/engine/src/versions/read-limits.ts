/* @layer core @kind logic */
import type { VersionLimits } from './python-range.type';
import { AT_LEAST, BELOW, MIN_DECLARED, RANGE_DECLARED } from './python-range.constants';
import { tupleVersion } from './tuple-version';

const readLimits = (header: string): VersionLimits => {
  const range = RANGE_DECLARED.exec(header);
  if (range?.[1] && range[2]) return { min: tupleVersion(range[1]), maxExclusive: tupleVersion(range[2]) };
  const minOnly = MIN_DECLARED.exec(header);
  if (minOnly?.[1]) return { min: tupleVersion(minOnly[1]) };
  const below = BELOW.exec(header);
  if (below?.[1]) return { min: tupleVersion(below[1]) };
  const atLeast = AT_LEAST.exec(header);
  if (atLeast?.[1]) return { maxExclusive: tupleVersion(atLeast[1]) };
  return {};
};

export { readLimits };
