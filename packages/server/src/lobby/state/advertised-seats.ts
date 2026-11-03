/* @layer core @kind logic */
import type { HeldSeat, OpenSeats } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { openSeatsOf } from './open-seats-of';
import { seatTaken } from './seat-taken';

type Advertised = { seats?: HeldSeat[]; open?: OpenSeats; allowedGames?: string[] };

const advertisedSeats = (lobby: Lobby): Advertised => {
  const open = openSeatsOf(lobby);
  const games = lobby.options.allowedGames ?? [];
  const named = lobby.seats ?? [];
  return {
    ...(named.length > 0 ? { seats: named.map((name) => ({ name, free: !seatTaken(lobby, name) })) } : {}),
    ...(open ? { open } : {}),
    ...(games.length > 0 ? { allowedGames: games } : {}),
  };
};

export { advertisedSeats };
