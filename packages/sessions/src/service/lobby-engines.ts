/* @layer core @kind logic */
import type { LobbyRun } from './lobby-run.type';

const lobbyEngines = (lobby: LobbyRun | undefined) => {
  if (!lobby) return {};
  return { runtime: lobby.runtime, host: lobby.hostRuntime ?? lobby.runtime, confine: lobby.confine, timeoutMs: lobby.timeoutMs };
};

export { lobbyEngines };
