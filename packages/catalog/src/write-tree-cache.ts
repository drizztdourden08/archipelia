/* @layer core @kind logic */
import type { CacheTarget } from './file-cache.type';
import type { IndexSource } from './index-source.type';
import type { TreeCache } from './tree-cache.type';
import { treeCachePath } from './tree-cache-path';

const writeTreeCache = async (source: IndexSource, { files, cacheDir }: CacheTarget, cache: TreeCache) => {
  await files.writeText(treeCachePath(source, cacheDir), JSON.stringify(cache)).catch(() => undefined);
};

export { writeTreeCache };
