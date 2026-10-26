/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { normalizePackageName, parseWheelName, readWheelMetadata } from '@archipelia/engine';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { LoadedWheel, WheelDownload, WheelLabel } from './wheel.type';
import { loadWheel } from './load-wheel';
import { pruneWheels } from './prune-wheels';
import { safeRequires } from './safe-requires';
import { wheelDir } from './wheel-dir';
import { SOURCE_FILE } from './wheel.constants';

const inspect = async (download: WheelDownload, label: WheelLabel, module: string | undefined) => {
  const found = await readWheelMetadata(download.file);
  const distribution = parseWheelName(label.asset)?.distribution ?? '';
  if (normalizePackageName(found.name) !== normalizePackageName(distribution)) throw new Error(`${label.asset} says it is ${found.name}, which does not match its file name.`);
  if (module !== undefined && !found.modules.includes(module)) throw new Error(`${label.asset} does not contain the package ${module}.`);
  safeRequires(label.asset, found.requires);
};

const storeWheel = async (runtime: EngineRuntime, download: WheelDownload, label: WheelLabel, module?: string): Promise<LoadedWheel> => {
  try {
    await inspect(download, label, module);
    const dir = wheelDir(runtime, download.sha256);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    await rename(download.file, join(dir, label.asset));
    await writeFile(join(dir, SOURCE_FILE), JSON.stringify(label), 'utf8');
  } catch (err) {
    await rm(download.file, { force: true });
    throw err;
  }
  await pruneWheels(runtime, download.sha256).catch(() => undefined);
  return loadWheel(runtime, download.sha256);
};

export { storeWheel };
