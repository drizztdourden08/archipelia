/* @layer core @kind logic */
import type { PlayerRowsInput } from './player-rows.type';
import type { PlayerView } from './live-room.type';
import { withPresence } from './with-presence';
import { statusOf } from './status-of';
import { statusKey } from './status-key';

const playerRows = ({ players, statuses, watched, logChecks, online = {} }: PlayerRowsInput): PlayerView[] =>
  players.map((player) => {
    const own = watched !== null && watched.slot === player.slot && watched.team === player.team;
    return {
      slot: player.slot,
      name: player.name,
      game: player.game,
      status: withPresence(statusOf(statuses[statusKey(player.team, player.slot)]), online[player.name]),
      checked: own ? watched.checked : logChecks[player.name] ?? null,
      total: own ? watched.total : null,
    };
  });

export { playerRows };
