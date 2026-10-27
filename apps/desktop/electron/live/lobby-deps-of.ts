/* @layer electron-main @kind logic */
import type { SessionLobbyDeps } from '../sessions/sessions.type';
import type { LiveServiceDeps } from './live.type';

const lobbyDepsOf = async (deps: LiveServiceDeps, serverId: string): Promise<SessionLobbyDeps> => ({
  ...(await deps.lobbies(serverId)),
  slotOf: deps.slotOf,
  beforeOpen: deps.beforeOpen,
  assertConsent: deps.assertConsent,
  beforeRun: deps.beforeRun,
});

export { lobbyDepsOf };
