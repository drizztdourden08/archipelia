/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';

type FetchResult = { text: string; fromCache: boolean };

type CacheTarget = { files: FileStore; cacheDir: string };

export type { CacheTarget, FetchResult };
