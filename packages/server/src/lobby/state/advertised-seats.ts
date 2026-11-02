/* @layer core @kind logic */
import type { HeldSeat } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { seatTaken } from './seat-taken';

const advertisedSeats = (lobby: Lobby): { seats?: HeldSeat[] } =>
  lobby.seats && lobby.seats.length > 0 ? { seats: lobby.seats.map((name) => ({ name, free: !seatTaken(lobby, name) })) } : {};

export { advertisedSeats };
