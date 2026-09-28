/* @layer core @kind types */
import type { EngineRuntime } from '@archipelia/model';

type LocalHostOptions = { runtime: EngineRuntime; port: number; bindHost?: string; advertiseHost: string; stopTimeoutMs?: number };

export type { LocalHostOptions };
