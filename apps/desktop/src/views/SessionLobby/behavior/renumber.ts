/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const renumber = (players: SessionPlayer[]) => players.map((player, index) => ({ ...player, slot: index + 1 }));

export { renumber };
