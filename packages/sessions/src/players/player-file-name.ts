/* @layer core @kind logic */
import type { HostedPlayer } from '@archipelia/model';

const playerFileName = (player: HostedPlayer) => `P${String(player.slot).padStart(2, '0')}.yaml`;

export { playerFileName };
