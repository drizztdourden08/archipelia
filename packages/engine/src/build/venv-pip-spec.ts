/* @layer core @kind logic */
import type { BuildDirs, BuildSpec } from './build.type';
import { buildEnv } from './build-env';
import { BUILD_PIP_FLAGS, PYTHON_FLAGS } from './build.constants';
import { venvPython } from './venv-python';

const venvPipSpec = (dirs: BuildDirs, command: string, args: readonly string[]): BuildSpec => ({
  command: venvPython(dirs.venv),
  args: [...PYTHON_FLAGS, '-m', 'pip', command, ...BUILD_PIP_FLAGS, ...args],
  cwd: dirs.work,
  env: buildEnv(dirs),
});

export { venvPipSpec };
