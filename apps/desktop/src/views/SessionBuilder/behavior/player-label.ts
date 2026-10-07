/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const playerLabel = (player: SessionPlayer) => player.name.trim() || `Player ${player.slot}`;

export { playerLabel };
