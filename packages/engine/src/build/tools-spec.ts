/* @layer core @kind logic */
import type { BuildDirs, BuildSpec } from './build.type';
import { INSTALL_ONLY_FLAGS } from './build.constants';
import { venvPipSpec } from './venv-pip-spec';

const toolsSpec = (dirs: BuildDirs): BuildSpec =>
  venvPipSpec(dirs, 'install', [...INSTALL_ONLY_FLAGS, '--only-binary=:all:', '--no-deps', '--require-hashes', '-r', dirs.tools]);

export { toolsSpec };
