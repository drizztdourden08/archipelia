/* @layer electron-main @kind logic */
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import type { SessionLobbyDeps, StartPlan } from './sessions.type';
import { syncSession } from './sync-session';

const openLobbyId = async ({ template, source, lobbyId }: StartPlan, deps: SessionLobbyDeps): Promise<string> => {
  const current = lobbyId ? (await deps.list()).find((entry) => entry.id === lobbyId) : undefined;
  if (current && current.phase !== 'closed') return current.id;
  await deps.beforeOpen?.(template);
  return (await deps.act(lobbyRequest.open(template, source))).id;
};

const startSession = async (plan: StartPlan, deps: SessionLobbyDeps) => {
  const lobbyId = await openLobbyId(plan, deps);
  return { lobbyId, lobby: await syncSession({ ...plan, lobbyId }, deps) };
};

export { startSession };
