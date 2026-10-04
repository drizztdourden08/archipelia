/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { readRuntime } from '../runtime/read-runtime';
import { engineInstalled } from './engine-installed';

const loadRuntime = async (engineDir: string): Promise<EngineRuntime> => {
  if (!(await engineInstalled(engineDir))) throw new Error('the engine is not set up yet: open Settings, Engine');
  return readRuntime(engineDir);
};

export { loadRuntime };
