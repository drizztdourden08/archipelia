/* @layer core @kind logic */
import type { EngineStateFile } from '@archipelia/model';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ENGINE_DEFAULTS } from '../versions/engine-defaults.constants';
import { adoptEngines } from './adopt-engines';
import { currentTarget } from './current-target';
import { STATE_FILE } from './engine-state.constants';
import { isStateFile } from './is-state-file';
import type { StateOptions } from './state-options.type';

const readStored = async (engineRoot: string): Promise<EngineStateFile | undefined> => {
  try {
    const parsed: unknown = JSON.parse(stripBom(await readFile(join(engineRoot, STATE_FILE), 'utf8')));
    return isStateFile(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const readEngineState = async (engineRoot: string, options: StateOptions = {}): Promise<EngineStateFile> =>
  (await readStored(engineRoot)) ??
  adoptEngines({ engineRoot, defaults: options.defaults ?? ENGINE_DEFAULTS, target: options.target ?? currentTarget() });

export { readEngineState };
