/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { SEAT_NAME_LIMIT } from './lobbies.constants';

const heldSeatNames = (players: readonly SessionPlayer[]): string[] => {
  const names = players
    .filter((player) => player.direct === true && !player.game)
    .map((player) => player.name.trim())
    .filter((name) => name !== '' && name.length <= SEAT_NAME_LIMIT);
  return names.filter((name, at) => names.findIndex((other) => other.toLowerCase() === name.toLowerCase()) === at);
};

export { heldSeatNames };
