/* @layer core @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const playerFileName = (player: SessionPlayer) => `P${String(player.slot).padStart(2, '0')}.yaml`;

export { playerFileName };
