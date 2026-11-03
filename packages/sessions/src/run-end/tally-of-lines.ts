/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { createRunTally } from './create-run-tally';
import type { RunTally } from './run-end.type';

const tallyOfLines = (lines: readonly HostLogLine[], names: readonly string[]): RunTally => {
  const tally = createRunTally(names);
  lines.forEach(tally.add);
  return tally.snapshot();
};

export { tallyOfLines };
