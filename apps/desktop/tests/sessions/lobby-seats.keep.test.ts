/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionPlayer } from '@archipelia/model';
import { memberMeta } from '../../src/views/LobbyMembers/behavior/member-meta';
import { memberSeatActions } from '../../src/views/LobbyMembers/behavior/member-seat-actions';
import type { LobbyMembersModel } from '../../src/views/LobbyMembers/LobbyMembers.type';
import { seatActionsOf } from '../../src/views/SessionLobby/behavior/seat-actions-of';
import { seatDetail } from '../../src/views/SessionLobby/behavior/seat-detail';
import { seatsOf } from '../../src/views/SessionLobby/behavior/seats-of';
import { toggleOverrides } from '../../src/views/SessionLobby/behavior/toggle-overrides';
import { toggleSeat } from '../../src/views/SessionLobby/behavior/toggle-seat';
import { lobby, member, slot, world } from '../lobbies/lobby-fixtures';
import { PRESET, presetPlayer } from './session-fixtures';

const held: SessionPlayer = { slot: 2, name: 'Alice', direct: true };

describe('the seats of the lobby phase', () => {
  const saved = [presetPlayer(1, 'Drizzt'), held];

  test('draws saved players as saved, new ones as added here, and a direct seat with no game as held', () => {
    const players = [...saved, presetPlayer(3, 'Carol')];
    expect(seatsOf(players, saved, []).map((seat) => [seat.slot, seat.kind])).toEqual([[1, 'saved'], [2, 'held'], [3, 'added']]);
  });

  test('lets a player who connected take the held seat of the same name', () => {
    const joined = member({ displayName: 'Alice', admission: 'approved', slots: [slot({ name: 'Alice' })] });
    expect(seatsOf(saved, saved, [joined]).map((seat) => seat.slot)).toEqual([1]);
    const pending = member({ displayName: 'ALICE' });
    expect(seatsOf(saved, saved, [pending]).map((seat) => seat.slot)).toEqual([1]);
    const gone = member({ displayName: 'Alice', admission: 'removed' });
    expect(seatsOf(saved, saved, [gone]).map((seat) => seat.slot)).toEqual([1, 2]);
  });

  test('names the game and the preset of a seat, or the file or the own game', () => {
    expect(seatDetail(presetPlayer(1, 'A'), [PRESET])).toBe('Demo · Open');
    expect(seatDetail(presetPlayer(1, 'A', 'gone'), [PRESET])).toBe('Demo · no preset');
    expect(seatDetail({ slot: 1, name: 'A', game: 'Demo', source: { kind: 'yaml', fileName: 'a.yaml', yaml: '' } }, [])).toBe('Demo · from file');
    expect(seatDetail(held, [])).toBe('Their own game');
  });

  test('offers Remove and Duplicate on every seat and Keep in session only on an added one', () => {
    const calls: string[] = [];
    const actions = { edit: () => undefined, remove: (at: number) => calls.push(`remove ${at}`), duplicate: () => undefined, keep: (at: number) => calls.push(`keep ${at}`) };
    const savedSeat = { key: 'seat-1', slot: 1, player: presetPlayer(1, 'A'), kind: 'saved' as const };
    expect(seatActionsOf(savedSeat, 'A', false, actions).map((action) => action.id)).toEqual(['remove', 'duplicate']);
    const added = seatActionsOf({ ...savedSeat, kind: 'added' }, 'A', false, actions);
    expect(added.map((action) => action.id)).toEqual(['remove', 'duplicate', 'keep']);
    expect(added.find((action) => action.id === 'keep')).toMatchObject({ kind: 'primary', nameSuffix: 'A' });
    added.find((action) => action.id === 'keep')?.onSelect();
    added.find((action) => action.id === 'remove')?.onSelect();
    expect(calls).toEqual(['keep 1', 'remove 1']);
    expect(seatActionsOf(savedSeat, 'A', true, actions).every((action) => action.disabled)).toBe(true);
  });

  test('opens a seat, closes it on a second pick, and opens its overrides on their own', () => {
    expect(toggleSeat(null, 2)).toEqual({ slot: 2, overrides: false });
    expect(toggleSeat({ slot: 2, overrides: true }, 2)).toBeNull();
    expect(toggleSeat({ slot: 2, overrides: true }, 3)).toEqual({ slot: 3, overrides: false });
    expect(toggleOverrides({ slot: 2, overrides: false }, 2)).toEqual({ slot: 2, overrides: true });
    expect(toggleOverrides({ slot: 2, overrides: true }, 2)).toEqual({ slot: 2, overrides: false });
    expect(toggleOverrides(null, 4)).toEqual({ slot: 4, overrides: true });
  });
});

describe('the seats of the players who joined', () => {
  const model = (calls: string[]): LobbyMembersModel => ({
    lobby: lobby(), actionError: null, isBusy: () => false,
    review: () => calls.push('review'), remove: () => calls.push('remove'),
    approve: () => { calls.push('approve'); return Promise.resolve(undefined); }, refuse: () => { calls.push('refuse'); return Promise.resolve(undefined); },
  });

  test('puts Approve and Refuse on the card of a player who waits', () => {
    const calls: string[] = [];
    const actions = memberSeatActions(lobby(), member(), model(calls));
    expect(actions.map((action) => [action.id, action.kind ?? 'default', action.nameSuffix])).toEqual([['refuse', 'default', 'Zelda'], ['approve', 'primary', 'Zelda']]);
    for (const action of actions) action.onSelect();
    expect(calls).toEqual(['refuse', 'approve']);
  });

  test('puts Remove on an approved player and the review of a world that waits for consent', () => {
    const waiting = lobby({ members: [member({ admission: 'approved', slots: [slot({ state: 'waiting-consent', worldSha256: 'w1' })] })], worlds: [world()] });
    const [first] = waiting.members;
    const actions = memberSeatActions(waiting, first ?? member(), model([]));
    expect(actions.map((action) => action.id)).toEqual(['remove', 'world-Zelda']);
    expect(actions[1]).toMatchObject({ label: 'Review the world of', nameSuffix: 'Zelda', kind: 'primary' });
    expect(memberSeatActions(lobby({ phase: 'hosting' }), member(), model([]))).toEqual([]);
  });

  test('sums the games, the client, the trust and the first slot that is not ready on one line', () => {
    expect(memberMeta(member())).toBe('Unlisted Quest · Quest Client 1.4.2, unlisted');
    const checking = member({ trust: 'verified', slots: [slot({ state: 'checking' })] });
    expect(memberMeta(checking)).toBe('Unlisted Quest · Quest Client 1.4.2, registered and verified · Checking');
  });
});
