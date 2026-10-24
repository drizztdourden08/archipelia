/* @layer renderer-app @kind logic */
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { ROOM_PASSWORDS_IN_MEMORY } from '../../../lobbies/lobbies.constants';
import { SERVER_DOWN, SERVER_STARTING } from '../LobbyList.constants';

const serverNotice = (local: boolean, status: LobbyServerStatus | null): string | null => {
  if (!local || !status) return null;
  if (status.state === 'listening') return status.roomPasswords === 'memory' ? ROOM_PASSWORDS_IN_MEMORY : null;
  return status.state === 'starting' ? SERVER_STARTING : SERVER_DOWN;
};

export { serverNotice };
