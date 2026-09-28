/* @layer core @kind types */
import type { GameSchema } from './options.type';

type GameSource = 'official' | 'index' | 'file';

type WorldLayout = 'apworld' | 'folder';

type Stability = 'stable' | 'unstable' | 'alpha' | 'beta' | 'untested' | 'unknown';

type FuzzVerdict = { verdict: 'clean' | 'flaky' | 'broken'; fuzzedAt: string; seeds: number; failRate: number };

type CatalogVersion = { version: string; url: string; sha256?: string; fuzz?: FuzzVerdict };

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
};

export type { CatalogEntry, CatalogVersion, FuzzVerdict, GameSource, InstalledGame, Stability, WorldLayout };
