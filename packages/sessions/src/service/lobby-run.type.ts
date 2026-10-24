/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';
import type { EngineRuntime, SessionWorld } from '@archipelia/model';

type LobbyRun = {
  lobbyId: string;
  worlds: SessionWorld[];
  runtime: EngineRuntime;
  hostRuntime?: EngineRuntime;
  confine?: (runDir: string) => SpawnWrap | undefined;
  timeoutMs?: number;
};

export type { LobbyRun };
