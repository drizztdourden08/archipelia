/* @layer testing @kind types */

type ZipEntry = { name: string; data: Uint8Array };

type ApworldSpec = {
  module: string;
  game: string;
  worldVersion: string;
  minimumAp?: string;
  maximumAp?: string;
  size: number;
};

type YamlSpec = { name: string; game: string; size: number };

export type { ApworldSpec, YamlSpec, ZipEntry };
