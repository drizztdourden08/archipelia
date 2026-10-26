/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { readySlots } from '../../src/lobbies/ready-slots';
import { RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { DirectRunDeps } from './sessions.type';
import { syncDirect } from './sync-direct';

const runDirect = async (template: SessionTemplate, deps: DirectRunDeps) => {
  const lobby = await syncDirect(template, deps);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) throw new Error(TEXT.ran);
  if (readySlots(lobby.members) === 0) throw new Error(TEXT.nobodyReady);
  return deps.act(lobbyRequest.start(lobby.id));
};

export { runDirect };
