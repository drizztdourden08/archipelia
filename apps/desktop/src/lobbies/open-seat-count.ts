/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const openSeatCount = (players: readonly SessionPlayer[]): number => players.filter((player) => player.kind === 'direct').length;

export { openSeatCount };
