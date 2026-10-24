/* @layer core @kind logic */
import type { InstalledEngine } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { readFile, rename, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readInstalledEngine } from '../runtime/read-installed-engine';
import { RUNTIME_FILE } from '../runtime/read-runtime.constants';
import type { AdoptParams } from './adopt-one-engine.type';
import { engineFolder } from './engine-folder';
import { engineId } from './engine-id';
import { LEGACY_FOLDER } from './engine-state.constants';

const exists = (path: string) => stat(path).then(() => true, () => false);

const moveToId = async (engineRoot: string, name: string, id: string): Promise<string> => {
  if (id === name || (await exists(engineFolder(engineRoot, id)))) return name;
  try {
    await rename(engineFolder(engineRoot, name), engineFolder(engineRoot, id));
    return id;
  } catch {
    return name;
  }
};

const adoptLegacy = async (
  { engineRoot, name, defaults, target }: AdoptParams,
  stored: Record<string, unknown>,
): Promise<InstalledEngine | undefined> => {
  const folder = LEGACY_FOLDER.exec(name);
  const apVersion = typeof stored.apVersion === 'string' ? stored.apVersion : folder?.[1];
  if (!apVersion || folder?.[2] !== target) return undefined;
  const pinned = defaults.defaultPython[target];
  const python = pinned?.version ?? '';
  const pythonRelease = pinned?.release ?? '';
  const apCommit = apVersion === defaults.defaultAp.version ? defaults.defaultAp.commit : '';
  const id = await moveToId(engineRoot, name, python ? engineId(apVersion, python, target) : name);
  const stamp = join(engineFolder(engineRoot, id), RUNTIME_FILE);
  const builtAt = Math.round((await stat(stamp)).mtimeMs);
  const upgraded = { ...stored, id, apVersion, apCommit, pythonVersion: python, pythonRelease, target, builtAt, rules: [], packages: [] };
  await writeFile(stamp, JSON.stringify(upgraded, null, 2), 'utf8');
  return { id, ap: apVersion, apCommit, python, pythonRelease, target, builtAt, state: 'ready' };
};

const adoptOneEngine = async (params: AdoptParams): Promise<InstalledEngine | undefined> => {
  const dir = engineFolder(params.engineRoot, params.name);
  const stored: unknown = JSON.parse(stripBom(await readFile(join(dir, RUNTIME_FILE), 'utf8')));
  if (!isRecord(stored)) return undefined;
  if (typeof stored.id === 'string' && typeof stored.pythonVersion === 'string') return readInstalledEngine(dir);
  return adoptLegacy(params, stored);
};

export { adoptOneEngine };
