/* @layer core @kind logic */
import { readEngineState } from '../state/read-engine-state';
import { engineFolder } from '../state/engine-folder';
import { ENGINE_DIR_ENV } from './engine-location.constants';

const activeEngineDir = async (engineRoot: string): Promise<string | undefined> => {
  const forced = process.env[ENGINE_DIR_ENV];
  if (forced) return forced;
  const { active } = await readEngineState(engineRoot);
  return active ? engineFolder(engineRoot, active) : undefined;
};

export { activeEngineDir };
