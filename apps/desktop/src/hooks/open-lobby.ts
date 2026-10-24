/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { lobbyRoute } from './lobby-route';

const openLobby = (serverId: string, lobbyId: string): void => nav.open(lobbyRoute(serverId, lobbyId));

export { openLobby };
