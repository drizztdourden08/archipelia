/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { DirectRunDeps } from './sessions.type';
import { syncDirect } from './sync-direct';

const runDirect = async (template: SessionTemplate, deps: DirectRunDeps) => {
  const lobby = await syncDirect(template, deps);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) throw new Error(TEXT.ran);
  return deps.act(lobbyRequest.start(lobby.id));
};

export { runDirect };
