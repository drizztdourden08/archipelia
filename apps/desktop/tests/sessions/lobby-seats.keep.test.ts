/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionPlayer } from '@archipelia/model';
import { memberMeta } from '../../src/views/LobbyMembers/behavior/member-meta';
import { memberSeatActions } from '../../src/views/LobbyMembers/behavior/member-seat-actions';
import { memberStatus } from '../../src/views/LobbyMembers/behavior/member-status';
import type { LobbyMembersModel } from '../../src/views/LobbyMembers/LobbyMembers.type';
import { ownSeatView } from '../../src/views/SessionLobby/behavior/own-seat-view';
import { seatMetaOf } from '../../src/views/SessionLobby/behavior/seat-meta-of';
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

  test('says the slot, the game and the origin of a seat, then its preset, its file or no preset', () => {
    const seat = (player: SessionPlayer, kind: 'saved' | 'added' = 'saved') => ({ key: 'seat', slot: player.slot, player, kind });
    expect(seatMetaOf(seat(presetPlayer(1, 'A')), [PRESET])).toEqual(['Slot 1 · Demo · Saved', 'Preset Open']);
    expect(seatMetaOf(seat(presetPlayer(3, 'A', 'gone'), 'added'), [PRESET])).toEqual(['Slot 3 · Demo · Added here', 'No preset']);
    expect(seatMetaOf(seat({ slot: 1, name: 'A', game: 'Demo', source: { kind: 'yaml', fileName: 'a.yaml', yaml: '' } }), [])[1]).toBe('From file a.yaml');
    expect(seatMetaOf(seat({ slot: 4, name: 'A', game: '', source: { kind: 'preset', presetId: '', overrides: {} } }), [])[0]).toBe('Slot 4 · Their own game · Saved');
  });

  test('keeps Edit, Duplicate and Remove as tools, Keep in session only on an added seat, and Ready or Needs a fix as the status', () => {
    const calls: string[] = [];
    const actions = { edit: () => undefined, remove: (at: number) => calls.push(`remove ${at}`), duplicate: () => undefined, keep: (at: number) => calls.push(`keep ${at}`) };
    const context = { presets: [PRESET], problemSlots: new Set<number>(), busy: false, actions };
    const savedSeat = { key: 'seat-1', slot: 1, player: presetPlayer(1, 'A'), kind: 'saved' as const };
    const kept = ownSeatView(savedSeat, context);
    expect(kept.tools?.map((tool) => tool.id)).toEqual(['edit', 'duplicate', 'remove']);
    expect(kept).toMatchObject({ state: 'filled', actions: [], status: { label: 'Ready', tone: 'success' } });
    const added = ownSeatView({ ...savedSeat, kind: 'added' }, { ...context, problemSlots: new Set([1]) });
    expect(added.actions).toMatchObject([{ id: 'keep', primary: true, nameSuffix: 'A' }]);
    expect(added.status).toMatchObject({ label: 'Needs a fix', tone: 'warning' });
    added.actions?.[0]?.onSelect();
    added.tools?.find((tool) => tool.id === 'remove')?.onSelect();
    expect(calls).toEqual(['keep 1', 'remove 1']);
    expect(ownSeatView(savedSeat, { ...context, busy: true }).tools?.every((tool) => tool.disabled)).toBe(true);
    const waiting = ownSeatView({ key: 'seat-2', slot: 2, player: held, kind: 'held' }, context);
    expect(waiting).toMatchObject({ state: 'held', name: 'Slot 2', meta: ['Waiting for Alice to connect'] });
    expect(waiting.tools?.map((tool) => tool.id)).toEqual(['edit']);
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
    expect(actions.map((action) => [action.id, action.primary === true, action.nameSuffix])).toEqual([['approve', true, 'Zelda'], ['refuse', false, 'Zelda']]);
    for (const action of actions) action.onSelect();
    expect(calls).toEqual(['approve', 'refuse']);
  });

  test('puts Remove on an approved player and the review of a world that waits for consent', () => {
    const waiting = lobby({ members: [member({ admission: 'approved', slots: [slot({ state: 'waiting-consent', worldSha256: 'w1' })] })], worlds: [world()] });
    const [first] = waiting.members;
    const actions = memberSeatActions(waiting, first ?? member(), model([]));
    expect(actions.map((action) => action.id)).toEqual(['world-Zelda', 'remove']);
    expect(actions[0]).toMatchObject({ label: 'Review the world of', nameSuffix: 'Zelda', primary: true });
    expect(memberSeatActions(lobby({ phase: 'hosting' }), member(), model([]))).toEqual([]);
  });

  test('puts the games and Joined on one line, the client and its trust on the next, and the first slot that is not ready in the status', () => {
    expect(memberMeta(member())).toEqual(['Unlisted Quest · Joined', 'Quest Client 1.4.2, unlisted']);
    const checking = member({ trust: 'verified', admission: 'approved', slots: [slot({ state: 'checking' })] });
    expect(memberMeta(checking)[1]).toBe('Quest Client 1.4.2, registered and verified');
    expect(memberStatus(checking)).toMatchObject({ label: 'Checking', tone: 'info' });
    expect(memberStatus(member({ admission: 'approved', slots: [slot({ state: 'ok' })] }))).toMatchObject({ label: 'Ready', tone: 'success' });
  });
});
