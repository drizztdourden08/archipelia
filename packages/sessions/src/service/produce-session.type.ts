/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';
import type { EngineRuntime } from '@archipelia/model';
import type { DiskLimit } from './disk-limit/disk-limit.type';

type ProduceRun = {
  runtime: EngineRuntime;
  signal?: AbortSignal;
  confine?: ((runDir: string) => SpawnWrap | undefined) | undefined;
  timeoutMs?: number | undefined;
  disk?: DiskLimit | undefined;
};

type GenerateRun = { runtime: EngineRuntime; signal?: AbortSignal | undefined; wrap?: SpawnWrap | undefined; settingsDir: string | undefined; base: string };

type TimeLimit = { signal: AbortSignal | undefined; expired: () => boolean };

export type { GenerateRun, ProduceRun, TimeLimit };
