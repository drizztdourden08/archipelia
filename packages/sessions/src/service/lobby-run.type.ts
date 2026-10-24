/* @layer core @kind types */
import type { EngineRuntime, SessionWorld } from '@archipelia/model';

type LobbyRun = { lobbyId: string; worlds: SessionWorld[]; runtime: EngineRuntime };

export type { LobbyRun };
