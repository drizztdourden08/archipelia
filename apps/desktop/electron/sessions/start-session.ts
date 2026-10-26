/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';
import type { SessionLobbyDeps } from './sessions.type';
import { syncSession } from './sync-session';

const openLobbyId = async (template: SessionTemplate, deps: SessionLobbyDeps): Promise<string> => {
  const lobbyId = template.lobby?.lobbyId;
  const current = lobbyId ? (await deps.list()).find((entry) => entry.id === lobbyId) : undefined;
  if (current && current.phase !== 'closed') return current.id;
  await deps.beforeOpen?.(template);
  return (await deps.act(lobbyRequest.open(template))).id;
};

const startSession = async (template: SessionTemplate, deps: SessionLobbyDeps) => {
  const lobbyId = await openLobbyId(template, deps);
  return syncSession({ ...template, lobby: { serverId: lobbyServerOf(template), lobbyId } }, deps);
};

export { startSession };
