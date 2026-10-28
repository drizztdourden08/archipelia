/* @layer core @kind logic */
import type { TreeFile } from './fetch-tree.type';
import type { CacheTarget } from './file-cache.type';
import type { IndexSource } from './index-source.type';
import type { TreeCache } from './tree-cache.type';
import { treeCachePath } from './tree-cache-path';

const isFile = (value: unknown): value is TreeFile =>
  typeof value === 'object' && value !== null && typeof (value as TreeFile).path === 'string' && typeof (value as TreeFile).sha === 'string';

const readTreeCache = async (source: IndexSource, { files, cacheDir }: CacheTarget): Promise<TreeCache | null> => {
  const text = await files.readText(treeCachePath(source, cacheDir)).catch(() => null);
  if (text === null) return null;
  try {
    const stored = JSON.parse(text) as Partial<TreeCache>;
    return typeof stored.at === 'number' && Array.isArray(stored.files) && stored.files.every(isFile) ? { at: stored.at, files: stored.files } : null;
  } catch {
    return null;
  }
};

export { readTreeCache };
