/* @layer renderer-app @kind logic */
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { SERVER_DOWN, SERVER_STARTING } from '../LobbyList.constants';

const serverNotice = (local: boolean, status: LobbyServerStatus | null): string | null => {
  if (!local || !status || status.state === 'listening') return null;
  return status.state === 'starting' ? SERVER_STARTING : SERVER_DOWN;
};

export { serverNotice };
