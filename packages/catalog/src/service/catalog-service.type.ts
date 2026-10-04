/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { FileStore } from '@drizztdourden08/brock-core/platform';

type CatalogView = { apVersion: string; entries: CatalogEntry[]; problems: number; fetchedAt: number };

type InstallRequest =
  | { kind: 'index'; apworld: string; version: string }
  | { kind: 'official'; apworld: string }
  | { kind: 'file'; fileName: string; bytes: Uint8Array };

type CatalogServiceDeps = { files: FileStore; engineDir: () => string };

export type { CatalogServiceDeps, CatalogView, InstallRequest };
