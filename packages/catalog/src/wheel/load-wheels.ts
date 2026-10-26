/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { LoadedWheel } from './wheel.type';
import { loadWheel } from './load-wheel';

const loadWheels = async (runtime: EngineRuntime, ids: readonly string[] = []): Promise<LoadedWheel[]> => {
  const loaded: LoadedWheel[] = [];
  for (const id of new Set(ids)) loaded.push(await loadWheel(runtime, id));
  return loaded;
};

export { loadWheels };
