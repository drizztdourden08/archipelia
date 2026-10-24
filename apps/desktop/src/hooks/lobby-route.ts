/* @layer renderer-app @kind logic */
import { ROUTE } from './app-navigation.constants';

const lobbyRoute = (serverId: string, lobbyId: string): string => `${ROUTE.lobbies}/${encodeURIComponent(serverId)}/${encodeURIComponent(lobbyId)}`;

export { lobbyRoute };
