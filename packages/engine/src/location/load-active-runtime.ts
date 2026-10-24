/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { activeEngineDir } from './active-engine-dir';
import { loadRuntime } from './load-runtime';

const loadActiveRuntime = async (engineRoot: string): Promise<EngineRuntime> => {
  const dir = await activeEngineDir(engineRoot);
  if (!dir) throw new Error('the engine is not set up yet: open Settings, Engine');
  return loadRuntime(dir);
};

export { loadActiveRuntime };
