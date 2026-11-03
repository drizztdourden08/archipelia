/* @layer core @kind logic */
import type { DataFiles, RunEnd, RunEndReason, Session } from '@archipelia/model';
import { readTotals, runEndOf } from '../run-end';
import type { LiveSession } from './service-deps.type';

const liveEnd = async (files: DataFiles, session: Session, entry: LiveSession, reason: RunEndReason): Promise<RunEnd | undefined> => {
  await entry.tally.flush();
  return runEndOf({
    players: session.players ?? [],
    tally: entry.tally.snapshot(),
    endedAt: Date.now(),
    reason,
    totals: await readTotals(files, session),
  });
};

export { liveEnd };
