/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';

type FetchResult = { text: string; fromCache: boolean };

type CacheTarget = { files: DataFiles; cacheDir: string };

export type { CacheTarget, FetchResult };
