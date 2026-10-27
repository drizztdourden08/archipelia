/* @layer core @kind logic */
import { join } from 'node:path';
import type { BuildSpec } from '@archipelia/engine';
import { toolsSpec } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { buildToolsOf } from './build-tools-of';

const cratesSpec = async (deps: Pick<BuildDeps, 'toolsDir'>, build: ActiveBuild): Promise<BuildSpec> => {
  const { rust } = await buildToolsOf(deps, build, 'crates');
  if (!rust) throw new Error(BUILD_TEXT.noRust);
  const cargo = join(rust.cargo, 'bin', process.platform === 'win32' ? 'cargo.exe' : 'cargo');
  return { command: cargo, args: ['fetch', '--locked'], cwd: build.dirs.src, env: toolsSpec(build.dirs).env };
};

export { cratesSpec };
