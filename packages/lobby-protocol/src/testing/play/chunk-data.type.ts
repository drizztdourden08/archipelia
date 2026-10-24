/* @layer testing @kind types */
import type { ScenarioFile } from '../scenario/scenario.type';

type ChunkRequest = {
  files: ScenarioFile[];
  sha256: string;
  offset: number;
  size: number;
  corrupt: boolean;
};

export type { ChunkRequest };
