/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const updatePlayer = (players: SessionPlayer[], slot: number, change: (player: SessionPlayer) => SessionPlayer) =>
  players.map((player) => (player.slot === slot ? change(player) : player));

export { updatePlayer };
