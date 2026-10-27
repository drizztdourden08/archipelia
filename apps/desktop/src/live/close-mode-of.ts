/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { LiveCloseMode } from './live.type';

const closeModeOf = (lobby: AdminLobby | undefined): LiveCloseMode => {
  if (lobby?.phase === 'generating') return 'run';
  return lobby?.phase === 'hosting' && lobby.room?.state === 'hosting' ? 'room' : 'lobby';
};

export { closeModeOf };
