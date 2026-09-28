/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { CacheTarget } from './file-cache.type';
import type { IndexSource } from './index-source.type';

type CatalogOptions = CacheTarget & { source?: IndexSource; concurrency?: number };

type CatalogProblem = { path: string; message: string };

type Catalog = { apVersion: string; entries: CatalogEntry[]; problems: CatalogProblem[]; downloaded: number };

export type { Catalog, CatalogOptions, CatalogProblem };
