/* @layer client-kit @kind types */
import type { ApworldBuildRecord, IndexBuildInput } from '../index-manifest/index.type';

type ReleaseWorld = { file: string; sha256: string; size: number; bundle?: string };

type ReleaseCommon = {
  format: 1;
  game: string;
  module: string;
  worldVersion: string;
  minimumAp: string;
  maximumAp?: string;
  direct: boolean;
  kit: string;
  appVersion?: string;
};

type ReleaseManifest = ReleaseCommon & { builds?: ApworldBuildRecord[]; world?: ReleaseWorld };

type ReleaseCommonInput = {
  game: string;
  module: string;
  worldVersion: string;
  minimumAp: string;
  maximumAp?: string;
  direct: boolean;
  kit?: string;
  appVersion?: string;
};

type ReleaseInput = ReleaseCommonInput & { builds?: readonly IndexBuildInput[]; world?: ReleaseWorld };

export type { ReleaseInput, ReleaseManifest, ReleaseWorld };
