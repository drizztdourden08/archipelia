/* @layer core @kind logic */
import { readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BUILD_PREFIX, STALE_BUILD_MS } from './build.constants';

const sweepBuilds = async (now = Date.now(), root = tmpdir()): Promise<void> => {
  const names = (await readdir(root).catch(() => [])).filter((name) => name.startsWith(BUILD_PREFIX));
  for (const name of names) {
    const dir = join(root, name);
    const found = await stat(dir).catch(() => undefined);
    if (found?.isDirectory() === true && now - found.mtimeMs > STALE_BUILD_MS) await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
};

export { sweepBuilds };
