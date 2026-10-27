/* @layer core @kind logic */
import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { SourceBuildJob } from '@archipelia/model';
import { venvPython } from '@archipelia/engine';
import { rustHomesOf } from '../tool/rust-homes-of';
import type { ActiveBuild, BuildDeps, BuildTools } from './build.type';
import { PATH_TOOLS } from './build.constants';

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const buildToolsOf = async (deps: Pick<BuildDeps, 'toolsDir'>, build: ActiveBuild, job: SourceBuildJob): Promise<BuildTools> => {
  if (job !== 'wheel' && job !== 'crates') return { path: [], rust: undefined };
  const venvBin = build.pins.some((pin) => PATH_TOOLS.includes(pin.name.toLowerCase())) ? [dirname(venvPython(build.dirs.venv))] : [];
  const dir = await deps.toolsDir?.();
  const homes = dir === undefined ? undefined : rustHomesOf(dir);
  const rust = homes !== undefined && (await exists(join(homes.cargo, 'bin'))) ? homes : undefined;
  return { path: [...venvBin, ...(rust ? [join(rust.cargo, 'bin')] : [])], rust };
};

export { buildToolsOf };
