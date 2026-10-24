/* @layer core @kind types */
import type { EngineRuntime } from '@archipelia/model';

type GenerateRun = { runtime: EngineRuntime; settingsDir: string | undefined; signal?: AbortSignal };

export type { GenerateRun };
