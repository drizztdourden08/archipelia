/* @layer core @kind logic */
import type { EngineDefaults } from '../versions/engine-defaults.type';

const pinnedBuild = (defaults: EngineDefaults, target: string, apVersion: string) => {
  const pinned = defaults.defaultPython[target];
  return {
    python: pinned?.version ?? '',
    pythonRelease: pinned?.release ?? '',
    apCommit: apVersion === defaults.defaultAp.version ? defaults.defaultAp.commit : '',
  };
};

export { pinnedBuild };
