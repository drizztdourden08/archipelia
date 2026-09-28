/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const nextSlot = (players: SessionPlayer[]) => players.reduce((max, player) => Math.max(max, player.slot), 0) + 1;

export { nextSlot };
