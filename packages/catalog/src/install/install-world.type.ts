/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { CatalogEntry } from '@archipelia/model';
import type { Fetch } from './fetch-file.type';

type InstallWorldParams = { engineDir: string; files: FileStore; entry: CatalogEntry; version: string; fetch?: Fetch };

export type { InstallWorldParams };
