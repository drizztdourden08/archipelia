/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import { RESULT_PHASES } from './lobby-view.constants';

const hasResults = (lobby: AdminLobby): boolean => RESULT_PHASES.includes(lobby.phase) || lobby.failure !== undefined;

export { hasResults };
