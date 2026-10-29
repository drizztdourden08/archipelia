/* @layer core @kind logic */
import { INDEX_TIMEOUT_MS } from './fetch-tree.constants';
import { rawUrl } from './raw-url';
import type { IndexSource } from './index-source.type';
import type { CacheTarget, FetchResult } from './file-cache.type';
import type { TreeFile } from './fetch-tree.type';

const readThroughCache = async (source: IndexSource, { files, cacheDir }: CacheTarget, file: TreeFile): Promise<FetchResult> => {
  const cached = `${cacheDir}/${file.sha}.txt`;
  const hit = await files.readText(cached);
  if (hit !== null) return { text: hit, fromCache: true };
  const res = await fetch(rawUrl(source, file.path), { signal: AbortSignal.timeout(INDEX_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${file.path}: HTTP ${res.status}`);
  const text = await res.text();
  await files.writeText(cached, text);
  return { text, fromCache: false };
};

export { readThroughCache };
