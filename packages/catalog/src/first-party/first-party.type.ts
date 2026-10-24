/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryClient, RegistrySource } from '@archipelia/trust';

type ReleaseManifest = { game: string; worldVersion: string; minimumAp: string; maximumAp?: string; sha256: string; appVersion: string };

type ReleaseState =
  | { kind: 'found'; manifest: ReleaseManifest }
  | { kind: 'none' }
  | { kind: 'failed'; message: string };

type FirstPartyRead = { entries: CatalogEntry[]; clients: RegistryClient[]; problems: string[]; source: RegistrySource };

export type { FirstPartyRead, ReleaseManifest, ReleaseState };
