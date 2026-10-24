/* @layer core @kind logic */
import type { LobbyRun } from './lobby-run.type';

const lobbyEngines = (lobby: LobbyRun | undefined, runDir: string) => {
  if (!lobby) return {};
  return { runtime: lobby.runtime, host: lobby.hostRuntime ?? lobby.runtime, wrap: lobby.confine?.(runDir) };
};

export { lobbyEngines };
