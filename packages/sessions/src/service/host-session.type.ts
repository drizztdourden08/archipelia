/* @layer core @kind types */
import type { EngineRuntime } from '@archipelia/model';
import type { LiveSession, ServiceDeps } from './service-deps.type';

type HostRun = { deps: ServiceDeps; live: Map<string, LiveSession>; signal?: AbortSignal; runtime?: EngineRuntime | undefined };

export type { HostRun };
