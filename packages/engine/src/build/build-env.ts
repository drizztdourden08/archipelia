/* @layer core @kind logic */
import type { BuildDirs } from './build.type';
import { BUILD_ENV, COMPILER_VARS, SCRATCH_VARS, SYSTEM_VARS } from './build.constants';

const pick = (names: readonly string[], base: NodeJS.ProcessEnv): Record<string, string> => {
  const found: Record<string, string> = {};
  for (const name of names) {
    const value = base[name];
    if (value !== undefined && value !== '') found[name] = value;
  }
  return found;
};

const buildEnv = (dirs: BuildDirs, base: NodeJS.ProcessEnv = process.env): Record<string, string> => {
  const scratch = Object.fromEntries(SCRATCH_VARS.map((name) => [name, dirs.scratch]));
  return { ...pick(COMPILER_VARS, base), ...pick(SYSTEM_VARS, base), ...BUILD_ENV, ...scratch };
};

export { buildEnv };
