/* @layer core @kind config */
import type { LobbyPhase } from '@archipelia/model';

const CODE_ATTEMPTS = 20;
const LOBBY_ID_BYTES = 4;

const LOCKABLE_PHASES: LobbyPhase[] = ['open'];
const ROOM_COMMAND_LIMIT = 500;
const LINE_BREAK = /[\r\n]/;

const EDITABLE_PHASES: LobbyPhase[] = ['open', 'locked', 'failed'];

export { CODE_ATTEMPTS, EDITABLE_PHASES, LINE_BREAK, LOBBY_ID_BYTES, LOCKABLE_PHASES, ROOM_COMMAND_LIMIT };
