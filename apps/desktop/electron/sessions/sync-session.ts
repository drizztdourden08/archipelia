/* @layer electron-main @kind logic */
import type { AdminLobby, SessionPlayer } from '@archipelia/model';
import { CONNECTED_ADMISSIONS } from '../../src/lobbies/lobbies.constants';
import type { HostPlayerSlot } from '../../src/lobbies/lobbies.type';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { HOST_NAME, RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { SessionLobbyDeps, SyncPlan } from './sessions.type';

const closeToClients = async (lobby: AdminLobby, deps: SessionLobbyDeps) => {
  const clients = lobby.members.filter((member) => member.kind === 'client' && CONNECTED_ADMISSIONS.includes(member.admission));
  for (const client of clients) await deps.act(lobbyRequest.remove(lobby.id, client.id));
  if (lobby.phase === 'open') await deps.act(lobbyRequest.lock(lobby.id));
};

const slotWithOrigin = (plan: SyncPlan, deps: SessionLobbyDeps) => async (player: SessionPlayer): Promise<HostPlayerSlot> =>
  ({ ...(await deps.slotOf(player)), origin: plan.savedNames.has(player.name) ? 'saved' : 'added' });

const syncSession = async (plan: SyncPlan, deps: SessionLobbyDeps) => {
  const { template, lobbyId, source } = plan;
  const lobby = (await deps.list()).find((entry) => entry.id === lobbyId);
  if (!lobby) throw new Error(TEXT.gone);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return lobby;
  const slots = await Promise.all(template.players.map(slotWithOrigin(plan, deps)));
  await deps.act(lobbyRequest.update(lobbyId, template, source));
  if (!template.direct) await closeToClients(lobby, deps);
  return deps.act(lobbyRequest.host(lobbyId, HOST_NAME, slots));
};

export { syncSession };
