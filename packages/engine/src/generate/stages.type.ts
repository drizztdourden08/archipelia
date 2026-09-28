/* @layer core @kind types */
import type { EngineStage } from '@archipelia/model';

type StageRule = { pattern: RegExp; stage: EngineStage; counts?: boolean; detail?: boolean };

export type { StageRule };
