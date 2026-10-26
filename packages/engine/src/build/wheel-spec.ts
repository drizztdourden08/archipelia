/* @layer core @kind logic */
import type { BuildDirs, BuildSpec } from './build.type';
import { venvPipSpec } from './venv-pip-spec';

const wheelSpec = (dirs: BuildDirs): BuildSpec =>
  venvPipSpec(dirs, 'wheel', ['--no-deps', '--no-build-isolation', '--no-index', '-w', dirs.out, dirs.src]);

export { wheelSpec };
