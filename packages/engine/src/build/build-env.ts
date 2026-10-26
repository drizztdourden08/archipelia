/* @layer core @kind logic */
import type { BuildDirs } from './build.type';
import { BUILD_ENV, COMPILER_VARS, SCRATCH_VARS } from './build.constants';

const buildEnv = (dirs: BuildDirs, base: NodeJS.ProcessEnv = process.env): Record<string, string> => {
  const kept: Record<string, string> = {};
  for (const name of COMPILER_VARS) {
    const value = base[name];
    if (value !== undefined && value !== '') kept[name] = value;
  }
  const scratch = Object.fromEntries(SCRATCH_VARS.map((name) => [name, dirs.scratch]));
  return { ...kept, ...BUILD_ENV, ...scratch };
};

export { buildEnv };
