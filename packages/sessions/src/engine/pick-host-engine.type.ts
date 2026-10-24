/* @layer core @kind types */
import type { EngineRuntime, Session, SessionEngine } from '@archipelia/model';

type HostEngineSource = {
  runtime: () => Promise<EngineRuntime>;
  runtimeFor?: (engine: SessionEngine) => Promise<EngineRuntime | undefined>;
};

type HostEngine = { runtime: EngineRuntime; warning?: string };

type HostEngineRequest = { source: HostEngineSource; session: Pick<Session, 'engine'> };

export type { HostEngine, HostEngineRequest, HostEngineSource };
