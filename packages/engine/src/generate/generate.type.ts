/* @layer core @kind types */
import type { EngineProgress, EngineRuntime, SpoilerLevel } from '@archipelia/model';
import type { SpawnWrap } from '../process/spawn-command.type';

type GenerateParams = {
  runtime: EngineRuntime;
  playersDir: string;
  outDir: string;
  spoiler: SpoilerLevel;
  race?: boolean;
  skipBalancing?: boolean;
  seed?: number;
  settingsDir?: string;
  onProgress?: (progress: EngineProgress) => void;
  onLine?: (line: string) => void;
  signal?: AbortSignal;
  wrap?: SpawnWrap;
};

type GenerateResult = { ok: boolean; zip?: string; lines: string[] };

export type { GenerateParams, GenerateResult };
