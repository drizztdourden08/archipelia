/* @layer core @kind logic */
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import type { EngineRuntime } from '@archipelia/model';
import type { OverlayInput } from '../lobby-service.type';
import { AP_DIR, CUSTOM_WORLDS, EMPTY_DIRS, FOLDER_WORLDS } from './overlay.constants';

const copyTree = async (from: string, to: string): Promise<void> => {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) await (EMPTY_DIRS.includes(entry.name) ? mkdir(target, { recursive: true }) : copyTree(source, target));
    else if (entry.isFile()) await copyFile(source, target);
  }
};

const moved = (runtime: EngineRuntime, dir: string, path: string) => join(dir, relative(runtime.root, path));

const buildOverlay = async ({ dir, runtime, worlds }: OverlayInput): Promise<EngineRuntime> => {
  const target = join(dir, AP_DIR);
  await rm(dir, { recursive: true, force: true });
  await copyTree(join(runtime.root, AP_DIR), target);
  await mkdir(join(target, CUSTOM_WORLDS), { recursive: true });
  for (const world of worlds) {
    const placed = join(target, CUSTOM_WORLDS, `${world.module}.apworld`);
    await rm(join(target, FOLDER_WORLDS, world.module), { recursive: true, force: true });
    await rm(placed, { force: true });
    await writeFile(placed, world.bytes);
  }
  return { ...runtime, root: dir, generate: moved(runtime, dir, runtime.generate), multiServer: moved(runtime, dir, runtime.multiServer) };
};

export { buildOverlay };
