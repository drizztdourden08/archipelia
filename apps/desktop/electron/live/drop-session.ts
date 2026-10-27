/* @layer electron-main @kind logic */
import type { LiveServiceDeps } from './live.type';

const dropSession = async (deps: LiveServiceDeps, sessionId: string): Promise<void> => {
  const tab = await deps.store.forSession(sessionId);
  if (!tab) return;
  await deps.closer.close({ templateId: sessionId, serverId: tab.serverId, lobbyId: tab.lobbyId });
  await deps.store.remove(tab.tabId);
};

export { dropSession };
