/* @layer renderer-app @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import type { AdminLobby, SessionPlayer } from '@archipelia/model';
import type { LobbyView } from '../stores/session-view-store.type';
import { lobbyPendingOf } from './lobby-pending-of';
import { lobbySeatsOf } from './lobby-seats-of';

const lobbyViewOf = (lobby: AdminLobby | undefined, players: readonly SessionPlayer[], events: readonly HostLogLine[]): LobbyView => {
  const members = lobby?.members ?? [];
  return { seats: lobbySeatsOf(players, members), pending: lobbyPendingOf(members), events };
};

export { lobbyViewOf };
