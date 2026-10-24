/* @layer core @kind logic */
import type { InstalledEngine } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readInstalledEngine } from '../runtime/read-installed-engine';
import { RUNTIME_FILE } from '../runtime/read-runtime.constants';
import type { AdoptParams } from './adopt-one-engine.type';
import { engineFolder } from './engine-folder';
import { upgradeEngineFolder } from './upgrade-engine-folder';

const adoptOneEngine = async (params: AdoptParams): Promise<InstalledEngine | undefined> => {
  const dir = engineFolder(params.engineRoot, params.name);
  const stored: unknown = JSON.parse(stripBom(await readFile(join(dir, RUNTIME_FILE), 'utf8')));
  if (!isRecord(stored)) return undefined;
  if (typeof stored.id === 'string' && typeof stored.pythonVersion === 'string') return readInstalledEngine(dir);
  return upgradeEngineFolder(params, stored);
};

export { adoptOneEngine };
