/* @layer core @kind logic */
import type { PythonBuild, PythonRange } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import { versionLine } from './version-line';

const pickPythonBuild = (builds: PythonBuild[], range: PythonRange, preferredLine?: string): PythonBuild | undefined => {
  const fitting = builds
    .filter((build) => compareVersions(build.version, range.min) >= 0)
    .filter((build) => range.maxExclusive === undefined || compareVersions(build.version, range.maxExclusive) < 0)
    .sort((a, b) => compareVersions(b.version, a.version));
  return fitting.find((build) => versionLine(build.version) === preferredLine) ?? fitting[0];
};

export { pickPythonBuild };
