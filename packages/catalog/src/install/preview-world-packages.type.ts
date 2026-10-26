/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { Fetch } from './fetch-file.type';

type PreviewWorldParams = { engineDir: string; entry: CatalogEntry; version: string; fetch?: Fetch; wheels?: string[] };

export type { PreviewWorldParams };
