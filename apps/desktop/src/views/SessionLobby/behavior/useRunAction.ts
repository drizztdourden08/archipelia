/* @layer renderer-app @kind hook */
import type { SessionTemplate } from '@archipelia/model';
import type { LiveTab } from '../../../live/live.type';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import type { RunAction } from '../SessionLobby.type';
import { runAction } from './run-action';

const useRunAction = (tab: LiveTab, draft: SessionTemplate, run: () => void): RunAction => {
  const lobby = useLobbyStore((state) => state.lobbies[tab.serverId]?.find((entry) => entry.id === tab.lobbyId));
  return runAction(draft, lobby, run);
};

export { useRunAction };
