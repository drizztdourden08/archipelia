/* @layer renderer-app @kind logic */
import type { AdminLobbyMember, SessionPlayer, SlotUpload } from '@archipelia/model';
import type { LobbySeat } from '../stores/session-view-store.type';
import { SEAT_TEXT, SLOT_SEAT } from './lobby-view.constants';

const seatOfSlot = (slot: SlotUpload, by: string): LobbySeat => ({ key: `joined-${by}-${slot.name}`, name: slot.name, game: slot.game, state: SLOT_SEAT[slot.state], meta: by });

const seatOfPlayer = (player: SessionPlayer): LobbySeat => {
  if (player.kind === 'direct') return { key: `seat-${player.slot}`, name: `${SEAT_TEXT.openSeat} ${player.slot}`, game: null, state: 'held', meta: SEAT_TEXT.held };
  return { key: `seat-${player.slot}`, name: player.name.trim() || `Player ${player.slot}`, game: player.game || null, state: 'ready', meta: SEAT_TEXT.yours };
};

const approvedClients = (members: readonly AdminLobbyMember[]): AdminLobbyMember[] => members.filter((member) => member.kind === 'client' && member.admission === 'approved');

const joinedSeats = (members: readonly AdminLobbyMember[]): LobbySeat[] =>
  approvedClients(members).flatMap((member) => member.slots.map((slot) => seatOfSlot(slot, member.displayName)));

const claimingSeats = (members: readonly AdminLobbyMember[]): LobbySeat[] =>
  approvedClients(members)
    .filter((member) => member.openSeat === true)
    .flatMap((member) => member.slots.map((slot) => seatOfSlot(slot, member.displayName)));

const lobbySeatsOf = (players: readonly SessionPlayer[], members: readonly AdminLobbyMember[]): LobbySeat[] => {
  const joined = joinedSeats(members);
  const claims = claimingSeats(members);
  const own = players.map((player) => (player.kind === 'direct' ? claims.shift() ?? seatOfPlayer(player) : seatOfPlayer(player)));
  const placed = new Set(own.map((seat) => seat.key));
  return [...own, ...joined.filter((seat) => !placed.has(seat.key))];
};

export { lobbySeatsOf };
