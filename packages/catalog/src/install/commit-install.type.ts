/* @layer core @kind types */
import type { EngineRuntime, GameSource, WorldLayout } from '@archipelia/model';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { ApworldInfo } from './read-apworld.type';
import type { HashDecision } from './hash-decision.type';

type InstallJob = {
  runtime: EngineRuntime;
  files: FileStore;
  file: string;
  info: ApworldInfo;
  apworld: string;
  game?: string;
  version?: string;
  source: GameSource;
  layout: WorldLayout;
  hash: HashDecision;
  requires: string[];
};

export type { InstallJob };
