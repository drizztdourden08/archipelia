/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { hintsKey } from '../../src/widgets/live-room/hints-key';
import { statusKey } from '../../src/widgets/live-room/status-key';
import { statusOf } from '../../src/widgets/live-room/status-of';
import { asHints } from '../../src/widgets/live-room/as-hints';
import { hintCounts } from '../../src/widgets/live-room/hint-counts';
import { hintRows } from '../../src/widgets/live-room/hint-rows';
import type { HintLookup, ProtocolHint } from '../../src/widgets/live-room/live-room.type';
import { checksFromLog } from '../../src/widgets/live-room/log-checks';
import { checksLabel } from '../../src/widgets/live-room/checks-label';
import { connectedCount } from '../../src/widgets/live-room/connected-count';
import { playerRows } from '../../src/widgets/live-room/player-rows';
import { roomPlayersOf } from '../../src/widgets/live-room/room-players-of';
import { roomUrls } from '../../src/widgets/live-room/room-urls';
import { targetKey } from '../../src/widgets/live-room/target-key';
import { watchTarget } from '../../src/widgets/live-room/watch-target';
import { templateOf } from '../sessions/session-fixtures';

const NAMES: Record<number, string> = { 1: 'Johnny', 2: 'Marie', 3: 'Sam Two' };
const GAMES: Record<number, string> = { 1: 'A Link to the Past', 2: 'Ocarina of Time', 3: 'Hollow Knight' };

const LOOKUP: HintLookup = {
  playerName: (slot) => NAMES[slot] ?? `Slot ${slot}`,
  gameOf: (slot) => GAMES[slot] ?? '',
  itemName: (game, id) => `${game} item ${id}`,
  locationName: (game, id) => `${game} spot ${id}`,
};

const hint = (patch: Partial<ProtocolHint>): ProtocolHint => ({
  receiving_player: 1, finding_player: 2, location: 10, item: 5, found: false, entrance: '', ...patch,
});

const session = (patch: Partial<Session>): Session => ({
  id: 's1',
  createdAt: 1,
  status: 'hosting',
  endpoint: { host: '0.0.0.0', port: 38281 },
  snapshot: templateOf({
    id: 't1', name: 'Friday', updatedAt: 1,
    players: [
      { slot: 2, name: 'Marie', game: 'Ocarina of Time', source: { kind: 'preset', presetId: 'p', overrides: {} } },
      { slot: 1, name: 'Johnny', game: 'A Link to the Past', source: { kind: 'preset', presetId: 'p', overrides: {} } },
    ],
  }),
  ...patch,
});

describe('client status', () => {
  test('data storage keys follow the protocol names', () => {
    expect(statusKey(0, 3)).toBe('_read_client_status_0_3');
    expect(hintsKey(1, 2)).toBe('_read_hints_1_2');
  });

  test('status codes map to the protocol steps', () => {
    expect(statusOf(undefined)).toBe('unknown');
    expect(statusOf(0)).toBe('offline');
    expect(statusOf(5)).toBe('connected');
    expect(statusOf(10)).toBe('ready');
    expect(statusOf(20)).toBe('playing');
    expect(statusOf(30)).toBe('goal');
  });
});

describe('hint rows', () => {
  test('the item is named in the receiver game, the location in the finder game', () => {
    const [row] = hintRows([[hint({})]], LOOKUP);
    expect(row).toMatchObject({
      key: '2-10', item: 'A Link to the Past item 5', receiver: 'Johnny', finder: 'Marie',
      location: 'Ocarina of Time spot 10', entrance: '', state: 'open',
    });
  });

  test('a hint listed for both players shows once, priority first, found last', () => {
    const shared = hint({ location: 11 });
    const rows = hintRows([[shared, hint({ location: 12, found: true })], [shared, hint({ location: 13, status: 30 })]], LOOKUP);
    expect(rows.map((row) => [row.key, row.state])).toEqual([['2-13', 'priority'], ['2-11', 'open'], ['2-12', 'found']]);
    expect(hintCounts(rows)).toEqual({ open: 2, found: 1 });
  });

  test('status codes and entrances', () => {
    const rows = hintRows([[
      hint({ location: 1, status: 20 }), hint({ location: 2, status: 10, entrance: 'Dam' }), hint({ location: 3, entrance: 'Vanilla' }),
    ]], LOOKUP);
    expect(rows.map((row) => row.state)).toEqual(['open', 'no priority', 'avoid']);
    expect(rows.find((row) => row.key === '2-2')?.entrance).toBe('Dam');
    expect(rows.find((row) => row.key === '2-3')?.entrance).toBe('');
  });

  test('asHints drops anything that is not a hint', () => {
    expect(asHints(null)).toEqual([]);
    expect(asHints([hint({}), { item: 'x' }, 3])).toHaveLength(1);
  });
});

describe('checks from the server log', () => {
  const LINES = [
    '[12:01:04] (Team #1) Johnny sent Hookshot to Marie (Kokiri Forest)',
    '(Team #1) Johnny sent Bow to Johnny (Eastern Palace)',
    '(Team #1) Johnny sent Bow to Johnny (Eastern Palace)',
    '(Team #1) Sam Two sent Dash to Marie (Crossroads)',
    'Notice (all): Sam has joined the game.',
    '(Team #1) Johnny: !hint Moon Pearl',
  ];

  test('counts distinct checks per sender and keeps names with spaces', () => {
    expect(checksFromLog(LINES, ['Johnny', 'Marie', 'Sam Two', 'Sam'])).toEqual({ Johnny: 2, 'Sam Two': 1 });
  });
});

describe('player rows', () => {
  test('the watched slot gets exact numbers, the others the log count', () => {
    const players = [{ team: 0, slot: 1, name: 'Johnny', game: 'ALttP' }, { team: 0, slot: 2, name: 'Marie', game: 'OoT' }];
    const rows = playerRows({
      players,
      statuses: { [statusKey(0, 1)]: 20, [statusKey(0, 2)]: 0 },
      watched: { team: 0, slot: 1, checked: 142, total: 216 },
      logChecks: { Johnny: 99, Marie: 88 },
    });
    expect(rows.map((row) => [row.status, checksLabel(row)])).toEqual([['playing', '142 / 216'], ['offline', '88 checks']]);
    expect(connectedCount(rows)).toBe(1);
  });

  test('without live data the planned players show in slot order', () => {
    const rows = playerRows({ players: roomPlayersOf(session({}).snapshot.players), statuses: {}, watched: null, logChecks: {} });
    expect(rows.map((row) => [row.name, row.status, checksLabel(row)]))
      .toEqual([['Johnny', 'unknown', 'no checks seen'], ['Marie', 'unknown', 'no checks seen']]);
  });
});

describe('room target', () => {
  test('a local room is watched over ws on localhost with the first slot', () => {
    const target = watchTarget(session({}));
    expect(target).toEqual({ sessionId: 's1', urls: ['ws://localhost:38281'], slotName: 'Johnny' });
    expect(targetKey(target)).toBe('s1|ws://localhost:38281|Johnny');
  });

  test('archipelago.gg tries wss first, then ws', () => {
    expect(roomUrls({ host: 'archipelago.gg', port: 51234 }, { kind: 'archipelago-gg' }))
      .toEqual(['wss://archipelago.gg:51234', 'ws://archipelago.gg:51234']);
  });

  test('nothing to watch unless hosting with an endpoint', () => {
    expect(watchTarget(session({ status: 'stopped' }))).toBeNull();
    expect(watchTarget(session({ endpoint: undefined }))).toBeNull();
    expect(targetKey(null)).toBe('');
  });
});
