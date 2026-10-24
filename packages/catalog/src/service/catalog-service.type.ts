/* @layer core @kind types */
import type { CatalogEntry, DataFiles } from '@archipelia/model';
import type { TrustedRootLoad } from '@archipelia/trust';
import type { FirstPartyRead } from '../first-party/first-party.type';
import type { Catalog } from '../read-catalog.type';

type CatalogView = { apVersion: string; entries: CatalogEntry[]; problems: number; fetchedAt: number };

type InstallRequest =
  | { kind: 'index'; apworld: string; version: string }
  | { kind: 'official'; apworld: string }
  | { kind: 'file'; fileName: string; bytes: Uint8Array };

type CatalogServiceDeps = {
  games: DataFiles;
  cache: DataFiles;
  engineDir: () => Promise<string>;
  fetch?: typeof fetch;
  trustRoot?: () => Promise<TrustedRootLoad['root']>;
};

type Latest = Catalog & { fetchedAt: number; firstParty: FirstPartyRead };

export type { CatalogServiceDeps, CatalogView, InstallRequest, Latest };
