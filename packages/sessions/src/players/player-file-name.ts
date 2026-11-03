/* @layer core @kind logic */
import type { SetPlayer } from '@archipelia/model';

const playerFileName = (player: SetPlayer) => `P${String(player.slot).padStart(2, '0')}.yaml`;

export { playerFileName };
