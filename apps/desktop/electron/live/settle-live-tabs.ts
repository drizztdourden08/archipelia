/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { onLan } from '../sessions/on-lan';
import type { LiveServiceDeps } from './live.type';
import { lobbyStateOf } from './lobby-state-of';
import { withoutLobbyId } from './without-lobby-id';

const moveLegacyLobby = async (deps: LiveServiceDeps, check: ReturnType<typeof lobbyStateOf>, template: SessionTemplate): Promise<void> => {
  const { lobby } = template;
  if (!lobby?.lobbyId) return;
  const found = await check(lobby.serverId, lobby.lobbyId);
  if (found.state === 'unknown') return;
  if (found.state === 'alive' && !(await deps.store.forSession(template.id))) {
    await deps.store.open({
      sessionId: template.id, serverId: lobby.serverId, lobbyId: lobby.lobbyId, overrides: {}, changes: [], lan: onLan(template), direct: template.direct !== undefined,
      ...(found.lobby.sessionId ? { runId: found.lobby.sessionId } : {}),
    });
  }
  await deps.templates.save(withoutLobbyId(template));
};

const settleLiveTabs = async (deps: LiveServiceDeps): Promise<void> => {
  const check = lobbyStateOf(deps);
  for (const template of await deps.templates.list()) await moveLegacyLobby(deps, check, template);
  for (const tab of await deps.store.list()) {
    if ((await check(tab.serverId, tab.lobbyId)).state === 'gone') await deps.store.remove(tab.tabId);
  }
};

export { settleLiveTabs };
