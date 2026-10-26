/* @layer renderer-app @kind hook */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyServerOf } from '../../../lobbies/lobby-server-of';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import type { RunAction, RunHandlers } from '../SessionLobby.type';
import { runAction } from './run-action';

const useRunAction = (draft: SessionTemplate, handlers: RunHandlers): RunAction => {
  const serverId = lobbyServerOf(draft);
  const lobbies = useLobbyStore((state) => state.lobbies[serverId]);
  return runAction(draft, lobbies, handlers);
};

export { useRunAction };
