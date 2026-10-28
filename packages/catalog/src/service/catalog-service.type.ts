/* @layer core @kind types */
import type { CatalogEntry, DataFiles } from '@archipelia/model';
import type { TrustedRootLoad } from '@archipelia/trust';
import type { BuildRunner, BuildSandbox } from '../build/build.type';
import type { ToolsPort } from '../source/source.type';
import type { PackageConsent } from '../install/package-consent.type';
import type { FirstPartyRead } from '../first-party/first-party.type';
import type { ReadySearch } from '../ready/ready.type';
import type { Catalog } from '../read-catalog.type';

type ReadyNotice = { total: number; shown: number };

type CatalogView = {
  apVersion: string;
  entries: CatalogEntry[];
  problems: number;
  fetchedAt: number;
  limited?: Catalog['limited'];
  ready?: ReadyNotice;
};

type InstallRequest =
  | { kind: 'index'; apworld: string; version: string; tag?: string; acceptPackages?: PackageConsent; acceptRepoId?: number; wheels?: string[] }
  | { kind: 'official'; apworld: string }
  | { kind: 'file'; fileName: string; bytes: Uint8Array; acceptPackages?: PackageConsent; wheels?: string[] };

type CatalogServiceDeps = {
  games: DataFiles;
  cache: DataFiles;
  engineDir: () => Promise<string>;
  fetch?: typeof fetch;
  trustRoot?: () => Promise<TrustedRootLoad['root']>;
  build?: BuildRunner | undefined;
  buildSandbox?: (() => Promise<BuildSandbox>) | undefined;
  tools?: ToolsPort | undefined;
  log?: ((message: string) => void) | undefined;
};

type Latest = Catalog & { fetchedAt: number; firstParty: FirstPartyRead; ready: ReadySearch };

export type { CatalogServiceDeps, CatalogView, InstallRequest, Latest };
