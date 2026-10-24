/* @layer renderer-app @kind logic */
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';

const lobbyMeta = (lobby: AdminLobby): string => `${formatLobbyCode(lobby.code) ?? lobby.code} · Archipelago ${lobby.engine.ap}`;

export { lobbyMeta };
