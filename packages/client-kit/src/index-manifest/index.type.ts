/* @layer client-kit @kind types */

type ApworldBuildRecord = {
  archipelagoVersion: string;
  file: string;
  sha256: string;
  size: number;
  bundle: string;
};

type ApworldIndex = {
  game: string;
  module: string;
  worldVersion: string;
  appVersion: string;
  minimumAp: string;
  maximumAp?: string;
  builds: ApworldBuildRecord[];
};

type IndexBuildInput = { archipelagoVersion: string; sha256: string; size: number };

type IndexInput = {
  game: string;
  module: string;
  worldVersion: string;
  appVersion: string;
  minimumAp: string;
  maximumAp?: string;
  builds: readonly IndexBuildInput[];
};

type ApworldNames = { file: string; bundle: string; latest: string; latestBundle: string; index: string };

export type { ApworldBuildRecord, ApworldIndex, ApworldNames, IndexBuildInput, IndexInput };
