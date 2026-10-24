/* @layer core @kind types */
import type { DataFiles, EngineRuntime } from '@archipelia/model';

type CarryWorldsParams = {
  from: EngineRuntime;
  to: EngineRuntime;
  files: DataFiles;
  reinstall: (apworld: string) => Promise<unknown>;
  reinstallFirstParty: (apworld: string) => Promise<unknown>;
  since?: number;
};

type CarryProblem = { apworld: string; game: string; reason: string };

type CarryResult = { copied: string[]; reinstalled: string[]; problems: CarryProblem[]; at: number };

export type { CarryProblem, CarryResult, CarryWorldsParams };
