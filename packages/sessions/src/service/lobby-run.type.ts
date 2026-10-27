/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';
import type { EngineRuntime, LobbySource, RunPlayer, SessionWorld } from '@archipelia/model';
import type { DiskLimit } from './disk-limit/disk-limit.type';

type LobbyRun = {
  lobbyId: string;
  worlds: SessionWorld[];
  source?: LobbySource;
  players?: RunPlayer[];
  runtime: EngineRuntime;
  hostRuntime?: EngineRuntime;
  confine?: (runDir: string) => SpawnWrap | undefined;
  timeoutMs?: number;
  disk?: DiskLimit;
};

export type { LobbyRun };
