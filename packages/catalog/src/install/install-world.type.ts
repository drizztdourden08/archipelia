/* @layer core @kind types */
import type { CatalogEntry, DataFiles } from '@archipelia/model';
import type { Fetch } from './fetch-file.type';

type InstallWorldParams = { engineDir: string; files: DataFiles; entry: CatalogEntry; version: string; fetch?: Fetch };

export type { InstallWorldParams };
