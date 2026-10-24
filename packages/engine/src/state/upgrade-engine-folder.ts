/* @layer core @kind logic */
import type { InstalledEngine } from '@archipelia/model';
import { stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RUNTIME_FILE } from '../runtime/read-runtime.constants';
import type { AdoptParams } from './adopt-one-engine.type';
import { engineFolder } from './engine-folder';
import { engineId } from './engine-id';
import { folderApVersion } from './folder-ap-version';
import { moveToId } from './move-to-id';
import { pinnedBuild } from './pinned-build';

const upgradeEngineFolder = async (
  { engineRoot, name, defaults, target }: AdoptParams,
  stored: Record<string, unknown>,
): Promise<InstalledEngine | undefined> => {
  const apVersion = folderApVersion(name, stored, target);
  if (!apVersion) return undefined;
  const { python, pythonRelease, apCommit } = pinnedBuild(defaults, target, apVersion);
  const id = await moveToId(engineRoot, name, python ? engineId(apVersion, python, target) : name);
  const stamp = join(engineFolder(engineRoot, id), RUNTIME_FILE);
  const builtAt = Math.round((await stat(stamp)).mtimeMs);
  const upgraded = { ...stored, id, apVersion, apCommit, pythonVersion: python, pythonRelease, target, builtAt, rules: [], packages: [] };
  await writeFile(stamp, JSON.stringify(upgraded, null, 2), 'utf8');
  return { id, ap: apVersion, apCommit, python, pythonRelease, target, builtAt, state: 'ready' };
};

export { upgradeEngineFolder };
