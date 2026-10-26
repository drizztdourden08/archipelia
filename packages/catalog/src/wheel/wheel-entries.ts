/* @layer core @kind logic */
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { CachedWheel } from './wheel.type';
import { SHA256 } from './wheel.constants';

const sizeOf = async (dir: string): Promise<number> => {
  const names = await readdir(dir);
  const sizes = await Promise.all(names.map((name) => stat(join(dir, name)).then((found) => found.size, () => 0)));
  return sizes.reduce((sum, size) => sum + size, 0);
};

const wheelEntries = async (root: string): Promise<CachedWheel[]> => {
  const found = await readdir(root, { withFileTypes: true }).catch(() => []);
  const dirs = found.filter((entry) => entry.isDirectory() && SHA256.test(entry.name));
  return Promise.all(dirs.map(async ({ name }) => {
    const dir = join(root, name);
    return { name, dir, size: await sizeOf(dir), at: (await stat(dir)).mtimeMs };
  }));
};

export { wheelEntries };
