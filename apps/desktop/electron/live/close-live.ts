/* @layer electron-main @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { LiveCloseMode, LiveTab } from '../../src/live/live.type';
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import { CLOSE_MODES, LIVE_TEXT } from './live.constants';
import type { LiveServiceDeps } from './live.type';

const isGenerating = (lobby: AdminLobby | undefined): boolean => lobby?.phase === 'generating';

const isHosting = (lobby: AdminLobby | undefined): boolean => lobby?.phase === 'hosting' && lobby.room?.state === 'hosting';

const lobbyOf = async (deps: LiveServiceDeps, tab: LiveTab): Promise<AdminLobby | undefined> => {
  try {
    return (await (await deps.lobbies(tab.serverId)).list()).find((entry) => entry.id === tab.lobbyId);
  } catch {
    return undefined;
  }
};

const cancelRun = async (deps: LiveServiceDeps, tab: LiveTab): Promise<void> => {
  if (tab.serverId !== LOCAL_SERVER) throw new Error(LIVE_TEXT.remoteCancel);
  if (!tab.runId) throw new Error(LIVE_TEXT.noRun);
  await deps.cancelRun(tab.runId);
};

const assertAllowed = (mode: LiveCloseMode, lobby: AdminLobby | undefined): void => {
  const busy = isGenerating(lobby) || isHosting(lobby);
  if (mode === 'lobby' && busy) throw new Error(LIVE_TEXT.closeBusy);
  if (mode === 'room' && isGenerating(lobby)) throw new Error(LIVE_TEXT.closeBusy);
};

const closeLive = async (deps: LiveServiceDeps, tabId: string, mode: unknown): Promise<{ closed: boolean }> => {
  const chosen = CLOSE_MODES.find((entry) => entry === mode);
  if (!chosen) throw new Error(LIVE_TEXT.badMode);
  const tab = await deps.store.get(tabId);
  if (!tab) throw new Error(LIVE_TEXT.noTab);
  const lobby = await lobbyOf(deps, tab);
  assertAllowed(chosen, lobby);
  if (chosen === 'run' && isGenerating(lobby)) await cancelRun(deps, tab);
  const result = await deps.closer.close({ templateId: tab.sessionId, serverId: tab.serverId, lobbyId: tab.lobbyId });
  await deps.store.remove(tabId);
  return result;
};

export { closeLive };
