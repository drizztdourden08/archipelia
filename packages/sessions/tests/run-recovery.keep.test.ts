/* @layer tests @kind test */
import { expect, test } from 'vitest';
import type { Session, SessionTemplate } from '@archipelia/model';
import { recoverRuns } from '../src/service/recover-runs';
import { createRunStore } from '../src/store/create-run-store';
import { runFiles } from './run-files';
import { SNAPSHOT } from './run-snapshot';

const START = 1_700_000_000_000;

const hosting = (id: string, host: SessionTemplate['host'] = SNAPSHOT.host): Session => ({
  id, snapshot: { ...SNAPSHOT, host }, status: 'hosting', createdAt: START - 1000, players: [{ slot: 1, name: 'Drizzt', game: 'Celeste' }],
});

const LINES = [
  { at: START, text: 'Hosting game at localhost:38281' },
  { at: START + 60_000, text: 'Notice (all): Drizzt (Team #1) playing Celeste has joined. Client(0.6.7), [].' },
  { at: START + 120_000, text: 'Notice (all): Drizzt (Team #1) has completed their goal.' },
  { at: START + 180_000, text: '(Team #1) Drizzt sent Strawberry to Drizzt (Chapter 1)' },
];

const recover = async (stored: Record<string, unknown>) => {
  const files = runFiles(stored);
  const runs = createRunStore(files);
  const update = (session: Session, patch: Partial<Session>) => runs.put({ ...session, ...patch });
  await recoverRuns({ files, runs, live: new Map(), update });
  return runs;
};

test('K1 a local run left hosting is closed from its saved server log, ended at the last line', { tags: ['critical'] }, async () => {
  const runs = await recover({ 'runs/r1.json': hosting('r1'), 'r1/server-log.json': LINES });
  const run = await runs.get('r1');
  expect(run?.status).toBe('stopped');
  expect(run?.end).toMatchObject({ reason: 'recovered', startedAt: START, endedAt: START + 180_000, finished: 1 });
  expect(run?.end?.slots[0]).toMatchObject({ status: 'goal', checked: 1, goalAfterMs: 120_000 });
});

test('K1 the saved tally wins over the log, and a run with neither is stopped with no end', { tags: ['critical'] }, async () => {
  const tally = { startedAt: START, lastAt: START + 900_000, checks: { Drizzt: 7 }, goals: {}, seen: { Drizzt: { first: START + 1000, last: START + 2000 } }, online: { Drizzt: false } };
  const runs = await recover({ 'runs/r1.json': hosting('r1'), 'r1/run-tally.json': tally, 'runs/r2.json': hosting('r2') });
  expect((await runs.get('r1'))?.end).toMatchObject({ endedAt: START + 900_000 });
  expect((await runs.get('r1'))?.end?.slots[0]).toMatchObject({ status: 'playing', checked: 7 });
  expect(await runs.get('r2')).toMatchObject({ status: 'stopped' });
  expect((await runs.get('r2'))?.end).toBeUndefined();
});

test('K1 a remote run is left hosting because its room outlives the app', { tags: ['critical'] }, async () => {
  const runs = await recover({ 'runs/r3.json': hosting('r3', { kind: 'remote', serverId: 's' }), 'r3/server-log.json': LINES });
  expect((await runs.get('r3'))?.status).toBe('hosting');
});
