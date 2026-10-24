/* @layer core @kind logic */
import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { apRoot } from '@archipelia/engine';
import type { CopyPlacedRequest } from './copy-placed-world.type';
import { PLACED } from './remove-world.constants';

const exists = (path: string) => stat(path).then(() => true, () => false);

const inside = (root: string, path: string) => path.startsWith(`${root}${sep}`);

const copyPlacedWorld = async ({ from, to, record }: CopyPlacedRequest) => {
  if (!PLACED.test(record.path)) throw new Error(`refusing to copy ${record.path}`);
  const [source, target] = [resolve(apRoot(from), record.path), resolve(apRoot(to), record.path)];
  if (!inside(apRoot(from), source) || !inside(apRoot(to), target)) throw new Error(`${record.path} is outside the engine`);
  if (!await exists(source)) throw new Error(`${record.path} is missing from the engine it was installed in`);
  await rm(target, { recursive: true, force: true });
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
};

export { copyPlacedWorld };
