/* @layer renderer-app @kind logic */
import type { AdminLobbyMember, SessionPlayer, SlotUpload } from '@archipelia/model';
import type { LobbySeat } from '../stores/session-view-store.type';
import { SEAT_TEXT, SLOT_SEAT } from './lobby-view.constants';

const seatOfSlot = (slot: SlotUpload, by: string): LobbySeat => ({ key: `joined-${by}-${slot.name}`, name: slot.name, game: slot.game, state: SLOT_SEAT[slot.state], meta: by });

const seatOfPlayer = (player: SessionPlayer): LobbySeat => {
  const held = player.direct === true && !player.game;
  return { key: `seat-${player.slot}`, name: player.name.trim() || `Player ${player.slot}`, game: player.game ?? null, state: held ? 'held' : 'ready', meta: held ? SEAT_TEXT.held : SEAT_TEXT.yours };
};

const joinedSeats = (members: readonly AdminLobbyMember[]): LobbySeat[] =>
  members.filter((member) => member.kind === 'client' && member.admission === 'approved').flatMap((member) => member.slots.map((slot) => seatOfSlot(slot, member.displayName)));

const lobbySeatsOf = (players: readonly SessionPlayer[], members: readonly AdminLobbyMember[]): LobbySeat[] => {
  const joined = joinedSeats(members);
  const byName = new Map(joined.map((seat) => [seat.name.toLowerCase(), seat]));
  const own = players.map(seatOfPlayer).map((seat) => (seat.state === 'held' ? byName.get(seat.name.toLowerCase()) ?? seat : seat));
  const placed = new Set(own.map((seat) => seat.key));
  return [...own, ...joined.filter((seat) => !placed.has(seat.key))];
};

export { lobbySeatsOf };
