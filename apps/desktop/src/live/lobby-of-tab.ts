/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { LiveTab } from './live.type';

const lobbyOfTab = (lobbies: Record<string, AdminLobby[] | undefined>, tab: Pick<LiveTab, 'serverId' | 'lobbyId'>): AdminLobby | undefined =>
  lobbies[tab.serverId]?.find((entry) => entry.id === tab.lobbyId);

export { lobbyOfTab };
