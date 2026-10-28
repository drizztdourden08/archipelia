/* @layer core @kind types */
import type { GameSchema } from './options.type';
import type { PackageSource } from './package-source/package-source.type';

type GameSource = 'official' | 'index' | 'file' | 'first-party';

type WorldLayout = 'apworld' | 'folder';

type Stability = 'stable' | 'unstable' | 'alpha' | 'beta' | 'untested' | 'unknown';

type FuzzVerdict = { verdict: 'clean' | 'flaky' | 'broken'; fuzzedAt: string; seeds: number; failRate: number };

type CatalogVersion = { version: string; url: string; sha256?: string; size?: number; fuzz?: FuzzVerdict };

type FirstPartyBuild = { archipelagoVersion: string; url: string; bundleUrl: string; sha256: string; size: number };

type FirstPartyRelease = {
  client?: string;
  repo?: string;
  bundleUrl: string;
  minimumAp?: string;
  maximumAp?: string;
  worldVersion?: string;
  appVersion?: string;
  builds?: FirstPartyBuild[];
};

type WorldTrust = { state: 'verified' | 'unverified'; detail: string };

type WorldOrigin = { repoId: number; repo: string };

type InstalledRelease = { tag: string; prerelease: boolean };

type DiscoveredWorld = WorldOrigin & { owner: string; stars: number; pushedAt: string; createdAt: string; direct: boolean; alsoInIndex?: boolean };

type CatalogEntry = {
  apworld: string;
  game: string;
  displayName: string;
  home?: string;
  setupGuide?: string;
  tracker?: string;
  tags: string[];
  source: GameSource;
  stability: Stability;
  versions: CatalogVersion[];
  requires?: string[];
  firstParty?: FirstPartyRelease;
  discovered?: DiscoveredWorld;
  unavailable?: string;
};

type InstalledGame = {
  apworld: string;
  game: string;
  version: string;
  source: GameSource;
  installedAt: number;
  schema: GameSchema;
  sha256: string;
  verified: boolean;
  layout: WorldLayout;
  path: string;
  requires: string[];
  packages?: string[];
  sources?: PackageSource[];
  trust?: WorldTrust;
  origin?: WorldOrigin;
  release?: InstalledRelease;
};

export type { CatalogEntry, CatalogVersion, DiscoveredWorld, FirstPartyBuild, FirstPartyRelease, FuzzVerdict, GameSource, InstalledGame, InstalledRelease, Stability, WorldLayout, WorldOrigin, WorldTrust };
