/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { BuildDirs, BuildSpec } from './build.type';
import { buildEnv } from './build-env';
import { PYTHON_FLAGS } from './build.constants';

const venvSpec = (runtime: EngineRuntime, dirs: BuildDirs): BuildSpec => ({
  command: runtime.python,
  args: [...PYTHON_FLAGS, '-m', 'venv', dirs.venv],
  cwd: dirs.work,
  env: buildEnv(dirs),
});

export { venvSpec };
