/* @layer renderer-app @kind logic */
import { appApi } from '../ipc/app-api';
import { closeModeOf } from '../live/close-mode-of';
import { lobbyOfTab } from '../live/lobby-of-tab';
import { useLiveStore } from '../stores/useLiveStore';
import { useLobbyStore } from '../stores/useLobbyStore';

const clearTabs = async (): Promise<void> => {
  await useLiveStore.getState().load();
  for (const tab of useLiveStore.getState().tabs) {
    await useLobbyStore.getState().load(tab.serverId).catch(() => undefined);
    await appApi().liveClose(tab.tabId, closeModeOf(lobbyOfTab(useLobbyStore.getState().lobbies, tab))).catch(() => undefined);
  }
  await useLiveStore.getState().load();
};

export { clearTabs };
