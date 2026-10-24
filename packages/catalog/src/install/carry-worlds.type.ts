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

export type { CarryWorldsParams };
