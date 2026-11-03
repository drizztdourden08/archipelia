/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { createRunTally } from './create-run-tally';
import { SAVE_EVERY_MS, TALLY_FILE } from './run-end.constants';
import type { LiveTally } from './run-end.type';
import type { HostLogLine } from '@archipelia/hosts';

const createLiveTally = (files: DataFiles, id: string, names: readonly string[]): LiveTally => {
  const tally = createRunTally(names);
  let savedAt = 0;
  const flush = () => files.writeJson(`${id}/${TALLY_FILE}`, tally.snapshot()).catch(() => undefined);
  const add = (line: HostLogLine) => {
    tally.add(line);
    if (line.at - savedAt < SAVE_EVERY_MS) return;
    savedAt = line.at;
    void flush();
  };
  return { add, snapshot: tally.snapshot, flush };
};

export { createLiveTally };
