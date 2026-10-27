/* @layer electron-main @kind logic */
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { readySlots } from '../../src/lobbies/ready-slots';
import { RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { SessionLobbyDeps, SyncPlan } from './sessions.type';
import { syncSession } from './sync-session';

const runSession = async (plan: SyncPlan, deps: SessionLobbyDeps) => {
  const lobby = await syncSession(plan, deps);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) throw new Error(TEXT.ran);
  if (readySlots(lobby.members) === 0) throw new Error(TEXT.nobodyReady);
  await deps.beforeRun?.(lobby.id, plan.template);
  return deps.act(lobbyRequest.start(lobby.id));
};

export { runSession };
