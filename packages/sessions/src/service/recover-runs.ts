/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import type { DataFiles, RunEnd, Session } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { readTotals, runEndOf, TALLY_FILE, tallyOfLines } from '../run-end';
import type { RunTally } from '../run-end';
import type { RunStore } from '../store/session-stores.type';
import type { LiveSession } from './service-deps.type';
import { SERVER_LINES } from './session-service.constants';

type RecoverRuns = {
  files: DataFiles;
  runs: RunStore;
  live: ReadonlyMap<string, LiveSession>;
  update: (session: Session, patch: Partial<Session>) => Promise<Session>;
};

const savedTally = async (files: DataFiles, id: string): Promise<RunTally | undefined> => {
  const saved = await files.readJson<unknown>(`${id}/${TALLY_FILE}`, null).catch(() => null);
  return isRecord(saved) && typeof saved.lastAt === 'number' ? (saved as RunTally) : undefined;
};

const recoveredEnd = async (files: DataFiles, session: Session): Promise<RunEnd | undefined> => {
  const players = session.players ?? [];
  const lines = await files.readJson<HostLogLine[]>(`${session.id}/${SERVER_LINES}`, []).catch(() => []);
  const tally = await savedTally(files, session.id) ?? tallyOfLines(lines, players.map((player) => player.name));
  return runEndOf({ players, tally, endedAt: tally.lastAt, reason: 'recovered', totals: await readTotals(files, session) });
};

const recoverRuns = async ({ files, runs, live, update }: RecoverRuns) => {
  const stale = (await runs.list()).filter((run) => run.status === 'hosting' && run.snapshot.host.kind === 'local' && !live.has(run.id));
  await Promise.all(stale.map(async (run) => {
    const end = run.end ?? await recoveredEnd(files, run);
    await update(run, { status: 'stopped', ...(end ? { end } : {}) });
  }));
};

export { recoverRuns };
