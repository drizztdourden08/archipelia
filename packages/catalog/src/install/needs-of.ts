/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { normalizePackageName } from '@archipelia/engine';
import type { LoadedWheel } from '../wheel/wheel.type';
import { loadWheels } from '../wheel/load-wheels';
import type { ApworldInfo } from './read-apworld.type';
import { namesOf } from './names-of';
import { worldPackages } from './world-packages';

const needsOf = async (runtime: EngineRuntime, info: ApworldInfo, label: string, ids?: string[]): Promise<{ wheels: LoadedWheel[]; declared: string[] }> => {
  const wheels = await loadWheels(runtime, ids);
  const provided = new Set(wheels.map((wheel) => normalizePackageName(wheel.source.name)));
  const own = worldPackages(info, label).filter((line) => !provided.has(namesOf([line])[0] ?? ''));
  return { wheels, declared: [...own, ...wheels.flatMap((wheel) => wheel.requires)] };
};

export { needsOf };
