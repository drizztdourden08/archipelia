/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionPlayer } from '@archipelia/model';
import { heldSeatNames } from '../../src/lobbies/held-seat-names';
import { sessionLobby } from '../../src/lobbies/session-lobby';
import { lobbyPendingOf } from '../../src/live/lobby-pending-of';
import { lobbySeatsOf } from '../../src/live/lobby-seats-of';
import { memberMeta } from '../../src/views/LobbyMembers/behavior/member-meta';
import { seatsOf } from '../../src/views/SessionLobby/behavior/seats-of';
import { member, slot } from '../lobbies/lobby-fixtures';
import { presetPlayer, templateOf } from './session-fixtures';

const held = (slotNumber: number, name: string): SessionPlayer => ({ slot: slotNumber, name, direct: true });

describe('K1 held seats named in a join request', { tags: ['critical'] }, () => {
  test('advertises the held seats of the session: direct players with no game, each name once', () => {
    const players = [presetPlayer(1, 'Drizzt'), held(2, 'Alice'), held(3, ' alice '), held(4, 'Bob'), held(5, ''), held(6, 'A name over sixteen')];
    expect(heldSeatNames(players)).toEqual(['Alice', 'Bob']);
  });

  test('sends the held seats with the lobby so the server can advertise them', () => {
    expect(sessionLobby(templateOf({ players: [held(1, 'Alice')] })).seats).toEqual(['Alice']);
    expect(sessionLobby(templateOf()).seats).toEqual([]);
  });

  test('shows the seat a waiting player asked for next to the client', () => {
    const asking = member({ seat: 'Alice' });
    expect(lobbyPendingOf([asking])[0]?.client).toBe('Quest Client 1.4.2, unlisted client, wants the seat Alice');
    expect(lobbyPendingOf([member()])[0]?.client).toBe('Quest Client 1.4.2, unlisted client');
    expect(memberMeta(asking)[2]).toBe('Wants the seat Alice');
    expect(memberMeta({ ...asking, admission: 'approved' })[2]).toBe('Seat Alice');
    expect(memberMeta(member())).toHaveLength(2);
  });

  test('puts an approved player in the held seat they named, whatever their own name', () => {
    const players = [held(1, 'Alice'), held(2, 'Bob')];
    const approved = member({ displayName: 'Zelda', admission: 'approved', seat: 'Alice', slots: [slot({ name: 'Zelda' })] });
    const seats = lobbySeatsOf(players, [approved]);
    expect(seats.map((seat) => [seat.name, seat.state])).toEqual([['Zelda', 'ready'], ['Bob', 'held']]);
  });

  test('leaves a held seat to its own name when the player named another seat', () => {
    const players = [held(1, 'Alice'), held(2, 'Bob')];
    const approved = member({ displayName: 'Zelda', admission: 'approved', seat: 'Alice', slots: [slot({ name: 'Bob' })] });
    const seats = lobbySeatsOf(players, [approved]);
    expect(seats.map((seat) => [seat.name, seat.state])).toEqual([['Bob', 'ready'], ['Bob', 'held']]);
  });

  test('hides the held seat of the lobby editor once a connected player claims it', () => {
    const saved = [presetPlayer(1, 'Drizzt'), held(2, 'Alice')];
    const claiming = member({ displayName: 'Zelda', seat: 'Alice', slots: [] });
    expect(seatsOf(saved, saved, [claiming]).map((seat) => seat.slot)).toEqual([1]);
    const wrong = member({ displayName: 'Alice', seat: 'Bob', slots: [] });
    expect(seatsOf(saved, saved, [wrong]).map((seat) => seat.slot)).toEqual([1, 2]);
  });
});
