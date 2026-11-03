/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const playerLabel = (player: SessionPlayer) => (player.kind === 'set' ? player.name.trim() || `Player ${player.slot}` : `Open seat ${player.slot}`);

export { playerLabel };
