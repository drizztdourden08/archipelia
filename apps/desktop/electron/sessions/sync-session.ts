/* @layer electron-main @kind logic */
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import { CONNECTED_ADMISSIONS } from '../../src/lobbies/lobbies.constants';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { HOST_NAME, RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { SessionLobbyDeps } from './sessions.type';

const closeToClients = async (lobby: AdminLobby, deps: SessionLobbyDeps) => {
  const clients = lobby.members.filter((member) => member.kind === 'client' && CONNECTED_ADMISSIONS.includes(member.admission));
  for (const client of clients) await deps.act(lobbyRequest.remove(lobby.id, client.id));
  if (lobby.phase === 'open') await deps.act(lobbyRequest.lock(lobby.id));
};

const syncSession = async (template: SessionTemplate, deps: SessionLobbyDeps) => {
  const lobbyId = template.lobby?.lobbyId;
  if (!lobbyId) throw new Error(TEXT.notStarted);
  const lobby = (await deps.list()).find((entry) => entry.id === lobbyId);
  if (!lobby) throw new Error(TEXT.gone);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return lobby;
  const slots = await Promise.all(template.players.map(deps.slotOf));
  await deps.act(lobbyRequest.update(lobbyId, template));
  if (!template.direct) await closeToClients(lobby, deps);
  return deps.act(lobbyRequest.host(lobbyId, HOST_NAME, slots));
};

export { syncSession };
