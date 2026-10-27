/* @layer core @kind logic */
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import type { SourceBuildEnd } from '@archipelia/model';
import type { ActiveBuild, BuildDeps } from './build.type';
import { buildToolsOf } from './build-tools-of';
import { runStep } from './run-step';

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const fetchCrates = async (deps: BuildDeps, build: ActiveBuild): Promise<SourceBuildEnd | undefined> => {
  const { rust } = await buildToolsOf(deps, build, 'crates');
  if (!rust || !(await exists(join(build.dirs.src, 'Cargo.lock')))) return undefined;
  return runStep(deps, build, 'crates');
};

export { fetchCrates };
