/* @layer core @kind logic */
import { writeFile } from 'node:fs/promises';
import type { SourceBuildEnd } from '@archipelia/model';
import type { ActiveBuild, BuildDeps } from './build.type';
import { fetchCrates } from './fetch-crates';
import { runStep } from './run-step';
import { toolsFileOf } from './tools-file-of';

const makeWheel = async (deps: BuildDeps, build: ActiveBuild): Promise<SourceBuildEnd | undefined> => {
  if (build.pins.length > 0) {
    await writeFile(build.dirs.tools, toolsFileOf(build.pins), 'utf8');
    const stopped = await runStep(deps, build, 'tools');
    if (stopped) return stopped;
  }
  const fetched = await fetchCrates(deps, build);
  if (fetched) return fetched;
  return runStep(deps, build, 'wheel');
};

export { makeWheel };
