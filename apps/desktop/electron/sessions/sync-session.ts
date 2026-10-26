/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { HOST_NAME, RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { SessionLobbyDeps } from './sessions.type';

const syncSession = async (template: SessionTemplate, deps: SessionLobbyDeps) => {
  const lobbyId = template.lobby?.lobbyId;
  if (!lobbyId) throw new Error(TEXT.notStarted);
  const lobby = (await deps.list()).find((entry) => entry.id === lobbyId);
  if (!lobby) throw new Error(TEXT.gone);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return lobby;
  const slots = await Promise.all(template.players.map(deps.slotOf));
  await deps.act(lobbyRequest.update(lobbyId, template));
  if (!template.direct && lobby.phase === 'open') await deps.act(lobbyRequest.lock(lobbyId));
  return deps.act(lobbyRequest.host(lobbyId, HOST_NAME, slots));
};

export { syncSession };
