/* @layer core @kind types */
import type { DataFiles, EngineRuntime, GameSource, WorldLayout, WorldTrust } from '@archipelia/model';
import type { ApworldInfo } from './read-apworld.type';
import type { HashDecision } from './hash-decision.type';
import type { PackageConsent } from './package-consent.type';

type InstallJob = {
  runtime: EngineRuntime;
  files: DataFiles;
  file: string;
  info: ApworldInfo;
  apworld: string;
  game?: string;
  version?: string;
  source: GameSource;
  layout: WorldLayout;
  hash: HashDecision;
  requires: string[];
  trust?: WorldTrust;
  packages?: PackageConsent;
  wheels?: string[];
};

export type { InstallJob };
