/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { HOST_NAME, RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { DirectRunDeps } from './sessions.type';

const syncDirect = async (template: SessionTemplate, deps: DirectRunDeps) => {
  const { direct } = template;
  if (!direct) throw new Error(TEXT.notDirect);
  const { lobbyId } = direct;
  const lobby = (await deps.list()).find((entry) => entry.id === lobbyId);
  if (!lobby) throw new Error(TEXT.gone);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) return lobby;
  const slots = await Promise.all(template.players.map(deps.slotOf));
  await deps.act(lobbyRequest.update(lobbyId, template, direct));
  return deps.act(lobbyRequest.host(lobbyId, HOST_NAME, slots));
};

export { syncDirect };
