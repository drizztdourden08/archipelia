/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { readySlots } from '../../src/lobbies/ready-slots';
import { RUNNABLE_PHASES, TEXT } from './sessions.constants';
import type { SessionLobbyDeps } from './sessions.type';
import { syncSession } from './sync-session';

const runSession = async (template: SessionTemplate, deps: SessionLobbyDeps) => {
  const lobby = await syncSession(template, deps);
  if (!RUNNABLE_PHASES.includes(lobby.phase)) throw new Error(TEXT.ran);
  if (readySlots(lobby.members) === 0) throw new Error(TEXT.nobodyReady);
  await deps.beforeRun?.(lobby.id, template);
  return deps.act(lobbyRequest.start(lobby.id));
};

export { runSession };
