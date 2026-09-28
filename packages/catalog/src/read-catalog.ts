/* @layer core @kind logic */
import { posix } from 'node:path';
import type { CatalogEntry } from '@archipelia/model';
import type { TreeFile } from './fetch-tree.type';
import { DEFAULT_INDEX } from './index-source.constants';
import type { Catalog, CatalogOptions, CatalogProblem } from './read-catalog.type';
import { fetchIndexTree } from './fetch-tree';
import { readThroughCache } from './file-cache';
import { isLockToml } from './is-lock-toml';
import { isRootToml } from './is-root-toml';
import { parseToml } from './parse-toml';
import { mapPool } from './pool';
import { parseEntry } from './parse-entry';

const findFile = (files: TreeFile[], path: string) => {
  const file = files.find((f) => f.path === path);
  if (!file) throw new Error(`index: ${path} missing`);
  return file;
};

const readCatalog = async ({ files: store, cacheDir, source = DEFAULT_INDEX, concurrency = 16 }: CatalogOptions): Promise<Catalog> => {
  const files = await fetchIndexTree(source);
  const read = (file: TreeFile) => readThroughCache(source, { files: store, cacheDir }, file);
  const [root, lock] = await Promise.all([read(findFile(files, 'index.toml')), read(findFile(files, 'index.lock'))]);
  const rootToml = parseToml(root.text, isRootToml, 'index.toml');
  const lockToml = parseToml(lock.text, isLockToml, 'index.lock');
  const problems: CatalogProblem[] = [];
  let downloaded = Number(!root.fromCache) + Number(!lock.fromCache);
  const entries = await mapPool(files.filter((f) => f.path.startsWith('index/')), concurrency, async (file) => {
    try {
      const got = await read(file);
      downloaded += Number(!got.fromCache);
      return parseEntry(source, posix.basename(file.path, '.toml'), got.text, lockToml);
    } catch (err) {
      problems.push({ path: file.path, message: (err as Error).message });
      return undefined;
    }
  });
  return {
    apVersion: rootToml.archipelago_version,
    entries: entries.filter((e): e is CatalogEntry => e !== undefined),
    problems,
    downloaded,
  };
};

export { readCatalog };
