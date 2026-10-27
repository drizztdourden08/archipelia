/* @layer core @kind logic */
import type { SourceBuildJob } from '@archipelia/model';
import type { BuildSpec } from '@archipelia/engine';
import { toolsSpec, venvSpec, wheelSpec } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps, BuildSession } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { JOB_PHASE } from './build-spec-of.constants';
import { confineBuild } from './confine-build';
import { parseBuildId } from './parse-build-id';

const specOf = (job: SourceBuildJob, { runtime, dirs }: ActiveBuild): BuildSpec => {
  if (job === 'venv') return venvSpec(runtime, dirs);
  if (job === 'tools') return toolsSpec(dirs);
  return wheelSpec(dirs);
};

const buildSpecOf = async (deps: Pick<BuildDeps, 'sandbox' | 'toolsDir'>, session: BuildSession, job: SourceBuildJob, raw: unknown): Promise<BuildSpec> => {
  const build = session.current();
  if (build?.id !== parseBuildId(raw) || !JOB_PHASE[job].includes(build.phase)) throw new Error(BUILD_TEXT.none);
  return confineBuild(deps, build, job, specOf(job, build));
};

export { buildSpecOf };
