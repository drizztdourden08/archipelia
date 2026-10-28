/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { AdminLobby } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { connectedCount } from '../lobbies/connected-count';
import { logFailure } from '../hooks/log-failure';
import { useLiveStore } from '../stores/useLiveStore';
import { useLobbyStore } from '../stores/useLobbyStore';
import { closeModeOf } from './close-mode-of';
import { CLOSE_FAILED, CLOSE_GENERATING, CLOSE_HOSTING, CLOSE_JOINED } from './live.constants';
import { lobbyOfTab } from './lobby-of-tab';
import type { LiveCloseMode } from './live.type';

const askBeforeClosing = (mode: LiveCloseMode, lobby: AdminLobby | undefined): ConfirmActionOptions | null => {
  if (mode === 'run') return CLOSE_GENERATING;
  if (mode === 'room') return CLOSE_HOSTING;
  return lobby && lobby.phase !== 'closed' && connectedCount(lobby) > 0 ? CLOSE_JOINED : null;
};

const closeTab = async (tabId: string): Promise<boolean> => {
  const tab = useLiveStore.getState().tabs.find((entry) => entry.tabId === tabId);
  if (!tab) return false;
  const lobby = lobbyOfTab(useLobbyStore.getState().lobbies, tab);
  const mode = closeModeOf(lobby);
  const ask = askBeforeClosing(mode, lobby);
  if (ask && !(await confirmAction(ask))) return false;
  try {
    await appApi().liveClose(tabId, mode);
    await useLiveStore.getState().load();
    return true;
  } catch (err) {
    logFailure(CLOSE_FAILED, err);
    toast(CLOSE_FAILED, { variant: 'danger' });
    return false;
  }
};

export { closeTab };
