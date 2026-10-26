/* @layer core @kind logic */
import type { BuildDirs, BuildSpec } from './build.type';
import { venvPipSpec } from './venv-pip-spec';

const toolsSpec = (dirs: BuildDirs): BuildSpec => venvPipSpec(dirs, 'install', ['--only-binary=:all:', '--no-deps', '-r', dirs.tools]);

export { toolsSpec };
