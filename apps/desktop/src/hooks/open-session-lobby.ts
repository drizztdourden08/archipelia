/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { LOBBY_SUB } from './app-navigation.constants';
import { sessionRoute } from './session-route';

const openSessionLobby = (id: string): void => nav.open(sessionRoute(id, LOBBY_SUB));

export { openSessionLobby };
