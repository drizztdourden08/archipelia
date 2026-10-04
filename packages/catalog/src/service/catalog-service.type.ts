/* @layer core @kind types */
import type { CatalogEntry, DataFiles } from '@archipelia/model';

type CatalogView = { apVersion: string; entries: CatalogEntry[]; problems: number; fetchedAt: number };

type InstallRequest =
  | { kind: 'index'; apworld: string; version: string }
  | { kind: 'official'; apworld: string }
  | { kind: 'file'; fileName: string; bytes: Uint8Array };

type CatalogServiceDeps = { games: DataFiles; cache: DataFiles; engineDir: () => string };

export type { CatalogServiceDeps, CatalogView, InstallRequest };
