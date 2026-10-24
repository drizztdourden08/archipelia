/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryClient, RegistrySource } from '@archipelia/trust';

type ReleaseManifest = { game: string; worldVersion: string; minimumAp: string; maximumAp?: string; sha256: string; appVersion: string };

type BuildRecord = { archipelagoVersion: string; file: string; sha256: string; size: number; bundle: string };

type BuildsManifest = {
  game: string;
  module: string;
  worldVersion: string;
  appVersion: string;
  minimumAp?: string;
  maximumAp?: string;
  builds: BuildRecord[];
};

type ReleaseState =
  | { kind: 'found'; manifest: ReleaseManifest }
  | { kind: 'builds'; manifest: BuildsManifest }
  | { kind: 'none' }
  | { kind: 'failed'; message: string };

type FirstPartyRead = { entries: CatalogEntry[]; clients: RegistryClient[]; problems: string[]; source: RegistrySource };

export type { BuildRecord, BuildsManifest, FirstPartyRead, ReleaseManifest, ReleaseState };
