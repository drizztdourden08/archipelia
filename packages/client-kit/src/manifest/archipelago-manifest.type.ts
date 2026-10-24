/* @layer client-kit @kind types */

type ArchipelagoManifest = {
  game: string;
  worldVersion: string;
  minimumAp?: string;
  maximumAp?: string;
  authors?: readonly string[];
  version?: number;
  compatibleVersion?: number;
};

type ManifestInput = {
  game: string;
  worldVersion: string;
  minimumAp: string;
  maximumAp?: string;
  authors?: readonly string[];
  version?: number;
  compatibleVersion?: number;
};

export type { ArchipelagoManifest, ManifestInput };
