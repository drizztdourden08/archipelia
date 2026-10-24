/* @layer core @kind logic */
import type { PythonBuild } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import type { EngineDefaults } from './engine-defaults.type';

const withPinnedPython = (builds: PythonBuild[], defaults: EngineDefaults, target: string): PythonBuild[] => {
  const pinned = defaults.defaultPython[target];
  if (!pinned || builds.some((build) => build.version === pinned.version)) return builds;
  const entry: PythonBuild = { ...pinned, target, pinned: true };
  return [...builds, entry].sort((a, b) => compareVersions(b.version, a.version));
};

export { withPinnedPython };
