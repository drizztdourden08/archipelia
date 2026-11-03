/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { SessionPlayer } from '@archipelia/model';
import { openSeatCount } from '../../src/lobbies/open-seat-count';
import { sessionLobby } from '../../src/lobbies/session-lobby';
import { lobbyPendingOf } from '../../src/live/lobby-pending-of';
import { lobbySeatsOf } from '../../src/live/lobby-seats-of';
import { memberMeta } from '../../src/views/LobbyMembers/behavior/member-meta';
import { seatsOf } from '../../src/views/SessionLobby/behavior/seats-of';
import { member, slot } from '../lobbies/lobby-fixtures';
import { presetPlayer, templateOf } from './session-fixtures';

const open = (slotNumber: number): SessionPlayer => ({ kind: 'direct', slot: slotNumber });

describe('K1 open seats of a session', { tags: ['critical'] }, () => {
  test('counts the open seats of the session: one for each direct player', () => {
    expect(openSeatCount([presetPlayer(1, 'Drizzt'), open(2), open(3)])).toBe(2);
    expect(openSeatCount([presetPlayer(1, 'Drizzt')])).toBe(0);
  });

  test('sends the open seat count and the allowed games with the lobby so the server can advertise them', () => {
    const params = sessionLobby(templateOf({ players: [open(1), open(2)] }));
    expect(params.openSeats).toBe(2);
    expect(sessionLobby(templateOf()).openSeats).toBe(0);
  });

  test('shows the seat a waiting player asked for next to the client', () => {
    const asking = member({ seat: 'Alice' });
    expect(lobbyPendingOf([asking])[0]?.client).toBe('Quest Client 1.4.2, unlisted client, wants the seat Alice');
    expect(lobbyPendingOf([member()])[0]?.client).toBe('Quest Client 1.4.2, unlisted client');
    expect(memberMeta(asking)[2]).toBe('Wants the seat Alice');
    expect(memberMeta({ ...asking, admission: 'approved' })[2]).toBe('Seat Alice');
    expect(memberMeta(member())).toHaveLength(2);
  });

  test('puts an approved player who took an open seat in the first open seat', () => {
    const players = [open(1), open(2)];
    const approved = member({ displayName: 'Zelda', admission: 'approved', openSeat: true, slots: [slot({ name: 'Zelda' })] });
    const seats = lobbySeatsOf(players, [approved]);
    expect(seats.map((seat) => [seat.name, seat.state])).toEqual([['Zelda', 'ready'], ['Open seat 2', 'held']]);
  });

  test('leaves the open seats alone when the player did not take one', () => {
    const players = [open(1)];
    const approved = member({ displayName: 'Zelda', admission: 'approved', slots: [slot({ name: 'Zelda' })] });
    const seats = lobbySeatsOf(players, [approved]);
    expect(seats.map((seat) => [seat.name, seat.state])).toEqual([['Open seat 1', 'held'], ['Zelda', 'ready']]);
  });

  test('hides an open seat of the lobby editor once a connected player claims it', () => {
    const saved = [presetPlayer(1, 'Drizzt'), open(2), open(3)];
    const claiming = member({ displayName: 'Zelda', openSeat: true, slots: [] });
    expect(seatsOf(saved, saved, [claiming]).map((seat) => seat.slot)).toEqual([1, 3]);
    const named = member({ displayName: 'Alice', seat: 'Bob', slots: [] });
    expect(seatsOf(saved, saved, [named]).map((seat) => seat.slot)).toEqual([1, 2, 3]);
    const gone = member({ displayName: 'Zelda', openSeat: true, admission: 'removed', slots: [] });
    expect(seatsOf(saved, saved, [gone]).map((seat) => seat.slot)).toEqual([1, 2, 3]);
  });
});
