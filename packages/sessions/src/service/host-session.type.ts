/* @layer core @kind types */
import type { LiveSession, ServiceDeps } from './service-deps.type';

type HostRun = { deps: ServiceDeps; live: Map<string, LiveSession>; signal?: AbortSignal };

export type { HostRun };
