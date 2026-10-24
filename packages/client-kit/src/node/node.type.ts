/* @layer client-kit @kind types */
import type { AssembledApworld, DataFile } from '../apworld/apworld.type';
import type { ApworldIndex } from '../index-manifest/index.type';
import type { ArchipelagoManifest, ManifestInput } from '../manifest/archipelago-manifest.type';

type LineEndings = 'lf' | 'keep';

type CollectOptions = { exclude?: readonly string[]; lineEndings?: LineEndings };

type BuildApworldOptions = Omit<ManifestInput, 'minimumAp'> & CollectOptions & {
  minimumAp: string;
  worldDir: string;
  module?: string;
  data?: Readonly<Record<string, DataFile>>;
  dataFolder?: string;
  dataDir?: string;
};

type ApworldBuild = AssembledApworld & { sha256: string; size: number };

type SetBuildSpec = {
  archipelagoVersion: string;
  worldDir?: string;
  dataFolder?: string;
  minimumAp?: string;
  maximumAp?: string;
};

type BuildSetOptions = Omit<BuildApworldOptions, 'worldDir' | 'minimumAp'> & {
  worldDir: string;
  minimumAp: string;
  appVersion: string;
  outDir: string;
  builds: readonly SetBuildSpec[];
};

type ApworldFileInfo = {
  module: string;
  manifest: ArchipelagoManifest;
  entries: readonly string[];
  sha256: string;
  size: number;
};

type SetFile = { archipelagoVersion: string; file: string; path: string; sha256: string; size: number; bundle: string };

type SetResult = { index: ApworldIndex; indexPath: string; latestPath: string; files: SetFile[] };

export type { ApworldBuild, ApworldFileInfo, BuildApworldOptions, BuildSetOptions, CollectOptions, LineEndings, SetBuildSpec, SetFile, SetResult };
