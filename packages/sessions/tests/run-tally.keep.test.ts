/* @layer tests @kind test */
import { expect, test } from 'vitest';
import type { RunPlayer } from '@archipelia/model';
import { createRunTally } from '../src/run-end/create-run-tally';
import { itemTypesName } from '../src/run-end/item-types-name';
import { runEndOf } from '../src/run-end';
import { totalsOf } from '../src/run-end/totals-of';

const START = 1_700_000_000_000;
const PLAYERS: RunPlayer[] = [
  { slot: 1, name: 'Link', game: 'Ship of Harkinian' },
  { slot: 2, name: 'Lunais', game: 'Timespinner' },
];

const line = (seconds: number, text: string) => ({ at: START + seconds * 1000, text });

const EARLY = [
  line(0, 'Hosting game at localhost:38281'),
  line(1, 'Notice (all): Link (Team #1) playing Ship of Harkinian has joined. Client(0.6.7), [].'),
  line(5, '(Team #1) Link sent Hookshot to Lunais (Kokiri Forest)'),
  line(9, 'Notice (all): Link (Team #1) has completed their goal.'),
];

const FILLER = Array.from({ length: 6000 }, (_, index) => line(20 + index, `Notice (all): chatter ${index}`));

test('K1 the running tally keeps the early facts after the log cap trimmed them away', { tags: ['critical'] }, () => {
  const tally = createRunTally(PLAYERS.map((player) => player.name));
  [...EARLY, ...FILLER].forEach(tally.add);
  const trimmed = [...EARLY, ...FILLER].slice(-5000);
  const endedAt = START + 7000 * 1000;
  const withTally = runEndOf({ players: PLAYERS, tally: tally.snapshot(), endedAt, reason: 'stopped' });
  const withLog = runEndOf({ players: PLAYERS, lines: trimmed, endedAt, reason: 'stopped' });
  expect(withTally?.startedAt).toBe(START);
  expect(withTally?.slots[0]).toMatchObject({ status: 'goal', checked: 1, goalAfterMs: 9000 });
  expect(withLog?.slots[0]?.status).toBe('never');
});

test('K1 a repeated check line counts once and a tracker joining does not mark a slot seen', { tags: ['critical'] }, () => {
  const tally = createRunTally(['Link']);
  [
    line(0, 'Hosting game'),
    line(1, "Notice (all): Link (Team #1) tracking Ship of Harkinian has joined. Client(0.6.7), ['Tracker']."),
    line(2, '(Team #1) Link sent Bow to Link (Eastern Palace)'),
    line(3, '[12:00:00] (Team #1) Link sent Bow to Link (Eastern Palace)'),
  ].forEach(tally.add);
  const snapshot = tally.snapshot();
  expect(snapshot.checks).toEqual({ Link: 1 });
  expect(snapshot.seen).toEqual({});
});

test('K1 totals count the placements each slot found and a bad file gives none', { tags: ['critical'] }, () => {
  const file = {
    version: 1,
    placements: [
      { finder: 'Link', location: 'A', item: 'X', receiver: 'Lunais', flags: 1 },
      { finder: 'Link', location: 'B', item: 'Y', receiver: 'Link', flags: 0 },
      { finder: 'Lunais', location: 'C', item: 'Z', receiver: 'Link', flags: 0 },
    ],
  };
  expect(totalsOf(file)).toEqual({ Link: 2, Lunais: 1 });
  expect(totalsOf('not json')).toBeUndefined();
  expect(totalsOf({ version: 1 })).toBeUndefined();
});

test('K1 the item types file is named after the spoiler, or after the zip when there is no spoiler', { tags: ['critical'] }, () => {
  expect(itemTypesName({ zip: 'AP_1.zip', files: [], spoiler: 'AP_1_Spoiler.txt', generateLog: 'g' })).toBe('AP_1_ItemTypes.json');
  expect(itemTypesName({ zip: 'AP_1.zip', files: [], generateLog: 'g' })).toBe('AP_1_ItemTypes.json');
  expect(itemTypesName(undefined)).toBeUndefined();
});
