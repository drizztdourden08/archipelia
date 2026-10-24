/* @layer core @kind logic */
import type { PythonRange } from '@archipelia/model';
import { branchesFor } from './branches-for';
import { BELOW, RAISES, WARNS } from './python-range.constants';
import { readBranches } from './read-branches';
import { readLimits } from './read-limits';
import { tupleVersion } from './tuple-version';

const parsePythonRange = (source: string, platform: string): PythonRange | undefined => {
  const branches = readBranches(source);
  const limits = branchesFor(branches.filter((branch) => RAISES.test(branch.body)), platform).map((branch) => readLimits(branch.header));
  const min = limits.find((limit) => limit.min)?.min;
  if (!min) return undefined;
  const maxExclusive = limits.find((limit) => limit.maxExclusive)?.maxExclusive;
  const warnHeader = branchesFor(branches.filter((branch) => !RAISES.test(branch.body) && WARNS.test(branch.body)), platform)
    .map((branch) => BELOW.exec(branch.header)?.[1])
    .find((tuple) => tuple);
  return {
    min,
    ...(maxExclusive ? { maxExclusive } : {}),
    ...(warnHeader ? { warnBelow: tupleVersion(warnHeader) } : {}),
    source: 'declared',
  };
};

export { parsePythonRange };
