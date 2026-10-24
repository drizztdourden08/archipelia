/* @layer electron-main @kind logic */
import { ENGINE_DEFAULTS } from '@archipelia/engine';
import type { EngineChoice } from '@archipelia/model';

const defaultChoice = (target: string): EngineChoice | undefined => {
  const python = ENGINE_DEFAULTS.defaultPython[target];
  return python ? { ap: ENGINE_DEFAULTS.defaultAp.version, python: python.version, pythonRelease: python.release } : undefined;
};

export { defaultChoice };
