/* @layer core @kind logic */
import type { IndexSource } from './index-source.type';

const treeCachePath = (source: IndexSource, cacheDir: string) => `${cacheDir}/tree-${source.owner}-${source.repo}-${source.ref}.json`.replace(/[^\w./-]/g, '_');

export { treeCachePath };
