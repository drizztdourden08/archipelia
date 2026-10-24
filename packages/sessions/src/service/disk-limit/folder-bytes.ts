/* @layer core @kind logic */
import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const sizeOf = (path: string) => lstat(path).then((stat) => stat.size, () => 0);

const folderBytes = async (dir: string, stopAt: number): Promise<number> => {
  let total = 0;
  let pending = [dir];
  while (pending.length > 0 && total <= stopAt) {
    const entries = (await Promise.all(pending.map((path) => readdir(path, { withFileTypes: true }).then((list) => ({ path, list }), () => ({ path, list: [] }))))).flat();
    const files = entries.flatMap(({ path, list }) => list.filter((entry) => entry.isFile()).map((entry) => join(path, entry.name)));
    total += (await Promise.all(files.map(sizeOf))).reduce((sum, size) => sum + size, 0);
    pending = entries.flatMap(({ path, list }) => list.filter((entry) => entry.isDirectory()).map((entry) => join(path, entry.name)));
  }
  return total;
};

export { folderBytes };
