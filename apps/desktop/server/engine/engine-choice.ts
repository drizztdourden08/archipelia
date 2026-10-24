/* @layer server @kind logic */
import { currentTarget, ENGINE_DEFAULTS } from '@archipelia/engine';
import type { EngineChoice } from '@archipelia/model';
import type { Core } from '@archipelia/server';

const engineChoice = async (core: Core, version: string, python: string): Promise<EngineChoice> => {
  const target = currentTarget();
  const tested = ENGINE_DEFAULTS.defaultPython[target];
  const ap = version === '' ? ENGINE_DEFAULTS.defaultAp.version : version;
  const wanted = python === '' ? tested?.version : python;
  if (!wanted) throw new Error(`There is no tested Python for ${target}. Name one with --python.`);
  if (tested?.version === wanted) return { ap, python: wanted, pythonRelease: tested.release };
  const { feed } = await core.engine.overview();
  const build = feed.python.find((entry) => entry.target === target && entry.version === wanted);
  if (!build) throw new Error(`Python ${wanted} is not in the version list for ${target}. Run engine list to see what is offered.`);
  return { ap, python: wanted, pythonRelease: build.release };
};

export { engineChoice };
