/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { renumber } from './renumber';

const removePlayer = (players: SessionPlayer[], slot: number) => renumber(players.filter((player) => player.slot !== slot));

export { removePlayer };
