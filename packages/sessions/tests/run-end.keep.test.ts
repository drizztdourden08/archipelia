/* @layer tests @kind test */
import { expect, test } from 'vitest';
import type { RunPlayer } from '@archipelia/model';
import { runEndOf } from '../src/run-end';

const MINUTE = 60_000;
const START = 1_700_000_000_000;

const PLAYERS: RunPlayer[] = [
  { slot: 1, name: 'Link', game: 'Ship of Harkinian' },
  { slot: 2, name: 'Lunais', game: 'Timespinner' },
  { slot: 3, name: 'Sam Two', game: 'Dark Souls III' },
  { slot: 4, name: 'Ghost', game: 'Celeste' },
];

const line = (minutes: number, text: string) => ({ at: START + minutes * MINUTE, text });

const LOG = [
  line(0, 'Hosting game at localhost:38281'),
  line(1, 'Notice (all): Link (Team #1) playing Ship of Harkinian has joined. Client(0.6.7), [].'),
  line(2, 'Notice (all): Link (Team #1) tracking Ship of Harkinian has joined. Client(0.6.7), [\'Tracker\'].'),
  line(3, 'Notice (all): Lunais (Team #1) playing Timespinner has joined. Client(0.6.7), [].'),
  line(10, '[12:01:04] (Team #1) Link sent Hookshot to Lunais (Kokiri Forest)'),
  line(11, '(Team #1) Link sent Bow to Link (Eastern Palace)'),
  line(11, '(Team #1) Link sent Bow to Link (Eastern Palace)'),
  line(20, '(Team #1) Sam Two sent Dash to Link (Crossroads)'),
  line(30, 'Notice (all): Link (Team #1) has completed their goal.'),
  line(40, 'Notice (all): Link (Team #1) has completed their goal.'),
  line(50, 'Notice (all): Lunais (Team #1) has left the game. Client(0.6.7), [].'),
  line(51, 'Notice (all): Sam Two (Team #1) playing Dark Souls III has joined. Client(0.6.7), [].'),
];

const endAt = START + 134 * MINUTE;

test('K1 the end state counts finished slots, the duration and each slot status', { tags: ['critical'] }, () => {
  const end = runEndOf({ players: PLAYERS, lines: LOG, endedAt: endAt, reason: 'stopped' });
  expect(end?.version).toBe(1);
  expect(end?.reason).toBe('stopped');
  expect(end?.startedAt).toBe(START);
  expect(end?.endedAt).toBe(endAt);
  expect(end?.durationMs).toBe(134 * MINUTE);
  expect(end?.finished).toBe(1);
  expect(end?.slots.map((slot) => [slot.slot, slot.status])).toEqual([[1, 'goal'], [2, 'connected'], [3, 'playing'], [4, 'never']]);
});

test('K1 a goal keeps the first completion time and how long after the start', { tags: ['critical'] }, () => {
  const link = runEndOf({ players: PLAYERS, lines: LOG, endedAt: endAt, reason: 'stopped' })?.slots[0];
  expect(link?.goalAt).toBe(START + 30 * MINUTE);
  expect(link?.goalAfterMs).toBe(30 * MINUTE);
  expect(link?.checked).toBe(2);
});

test('K1 first and last seen follow game clients, a player still online is seen until the end', { tags: ['critical'] }, () => {
  const slots = runEndOf({ players: PLAYERS, lines: LOG, endedAt: endAt, reason: 'stopped' })?.slots ?? [];
  expect(slots[0]).toMatchObject({ firstSeenAt: START + MINUTE, lastSeenAt: endAt });
  expect(slots[1]).toMatchObject({ firstSeenAt: START + 3 * MINUTE, lastSeenAt: START + 50 * MINUTE });
  expect(slots[3]?.firstSeenAt).toBeUndefined();
  expect(slots[3]?.goalAt).toBeUndefined();
});

test('K1 a known total is kept next to the checks and an empty log gives no end state', { tags: ['critical'] }, () => {
  const end = runEndOf({ players: PLAYERS, lines: LOG, endedAt: endAt, reason: 'stopped', totals: { Link: 120 } });
  expect(end?.slots[0]).toMatchObject({ checked: 2, total: 120 });
  expect(end?.slots[1]?.total).toBeUndefined();
  expect(runEndOf({ players: PLAYERS, lines: [], endedAt: endAt, reason: 'stopped' })).toBeUndefined();
});
