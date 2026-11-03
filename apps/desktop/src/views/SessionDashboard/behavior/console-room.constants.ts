/* @layer renderer-app @kind config */
import type { ConsoleRoom } from './console-room.type';

const PLAYER_SLOT = 'player';

const NO_ROOM: ConsoleRoom = { players: [], names: {} };

export { NO_ROOM, PLAYER_SLOT };
