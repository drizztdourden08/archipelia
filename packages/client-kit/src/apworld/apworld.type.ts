/* @layer client-kit @kind types */
import type { ArchipelagoManifest, ManifestInput } from '../manifest/archipelago-manifest.type';
import type { ApworldEntry } from '../zip/zip.type';

type DataFile = string | Uint8Array | number | boolean | null | readonly unknown[] | Readonly<Record<string, unknown>>;

type AssembleInput = ManifestInput & {
  module: string;
  files: readonly ApworldEntry[];
  data?: Readonly<Record<string, DataFile>>;
  dataDir?: string;
};

type AssembledApworld = {
  module: string;
  manifest: ArchipelagoManifest;
  manifestText: string;
  bytes: Uint8Array;
};

export type { AssembleInput, AssembledApworld, DataFile };
