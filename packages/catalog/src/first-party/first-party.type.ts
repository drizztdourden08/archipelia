/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { LoadRegistryDeps, Registry, RegistryClient, RegistrySource } from '@archipelia/trust';
import type { ReleasesRead } from '../versions/versions.type';

type ReleaseManifest = { game: string; module?: string; worldVersion: string; minimumAp: string; maximumAp?: string; sha256: string; appVersion?: string; size?: number };

type BuildRecord = { archipelagoVersion: string; file: string; sha256: string; size: number; bundle: string };

type BuildsManifest = {
  game: string;
  module: string;
  worldVersion: string;
  appVersion?: string;
  minimumAp?: string;
  maximumAp?: string;
  builds: BuildRecord[];
};

type ReleaseState =
  | { kind: 'found'; manifest: ReleaseManifest; names?: ReleaseNames }
  | { kind: 'builds'; manifest: BuildsManifest }
  | { kind: 'none' }
  | { kind: 'failed'; message: string };

type ReleaseNames = { world: string; bundle: string };

type StandardFile = { file: string; sha256: string; size: number; bundle?: string };

type StandardBuild = StandardFile & { archipelagoVersion: string };

type StandardManifest = {
  game: string;
  module: string;
  worldVersion: string;
  minimumAp: string;
  maximumAp?: string;
  appVersion?: string;
  builds?: StandardBuild[];
  world?: StandardFile;
};

type FirstPartyDeps = LoadRegistryDeps & { readReleases?: (repo: string) => Promise<ReleasesRead> };

type FirstPartyRead = { entries: CatalogEntry[]; clients: RegistryClient[]; registry: Registry; problems: string[]; source: RegistrySource };

export type { BuildRecord, BuildsManifest, FirstPartyDeps, FirstPartyRead, ReleaseManifest, ReleaseState, StandardBuild, StandardFile, StandardManifest };
