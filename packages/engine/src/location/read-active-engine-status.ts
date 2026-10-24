/* @layer core @kind logic */
import type { EngineStatus } from '@archipelia/model';
import { activeEngineDir } from './active-engine-dir';
import { readEngineStatus } from './read-engine-status';

const readActiveEngineStatus = async (engineRoot: string): Promise<EngineStatus> => {
  const dir = await activeEngineDir(engineRoot);
  return dir ? readEngineStatus(dir) : { state: 'missing', dir: engineRoot };
};

export { readActiveEngineStatus };
