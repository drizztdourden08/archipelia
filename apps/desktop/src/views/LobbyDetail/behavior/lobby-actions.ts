/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import { NO_READY_SLOT, STARTABLE_PHASES } from '../LobbyDetail.constants';
import type { LobbyActions } from '../LobbyDetail.type';
import { readySlotCount } from './ready-slot-count';

const lobbyActions = (lobby: AdminLobby): LobbyActions => {
  const startable = STARTABLE_PHASES.includes(lobby.phase);
  return {
    lock: lobby.phase === 'open',
    start: startable,
    startBlock: startable && readySlotCount(lobby) === 0 ? NO_READY_SLOT : null,
    close: lobby.phase !== 'closed',
    stopRoom: lobby.phase === 'hosting' && lobby.room?.state === 'hosting',
  };
};

export { lobbyActions };
