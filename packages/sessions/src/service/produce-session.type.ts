/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';
import type { EngineRuntime } from '@archipelia/model';

type ProduceRun = { runtime: EngineRuntime; signal?: AbortSignal; wrap?: SpawnWrap | undefined };

type GenerateRun = ProduceRun & { settingsDir: string | undefined };

export type { GenerateRun, ProduceRun };
