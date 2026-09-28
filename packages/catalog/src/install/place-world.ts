/* @layer core @kind logic */
import { copyFile, mkdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { apRoot } from '@archipelia/engine';
import type { ApworldInfo } from './read-apworld.type';
import type { PlaceRequest, Placement } from './place-world.type';
import { placedPath } from './placed-path';
import { BACKUP_DIR } from './place-world.constants';

const exists = (path: string) => stat(path).then(() => true, () => false);

const extractFolder = async ({ bytes, module }: ApworldInfo, target: string) => {
  const entries = unzipSync(bytes, { filter: ({ name }) => name.startsWith(`${module}/`) && !name.endsWith('/') });
  for (const [name, data] of Object.entries(entries)) {
    const out = resolve(target, name.slice(module.length + 1));
    if (!out.startsWith(`${target}${sep}`)) throw new Error(`${name}: path leaves the world folder`);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, data);
  }
};

const placeWorld = async ({ runtime, file, info, layout }: PlaceRequest): Promise<Placement> => {
  const path = placedPath(layout, info.module);
  const target = resolve(apRoot(runtime), path);
  const backup = join(runtime.root, BACKUP_DIR, basename(path));
  await rm(backup, { recursive: true, force: true });
  const had = await exists(target);
  if (had) {
    await mkdir(dirname(backup), { recursive: true });
    await rename(target, backup);
  }
  const rollback = async () => {
    await rm(target, { recursive: true, force: true });
    if (had) await rename(backup, target);
  };
  try {
    await mkdir(dirname(target), { recursive: true });
    if (layout === 'apworld') await copyFile(file, target);
    else await extractFolder(info, target);
  } catch (err) {
    await rollback();
    throw err;
  }
  return { path, rollback, commit: () => rm(backup, { recursive: true, force: true }) };
};

export { placeWorld };
