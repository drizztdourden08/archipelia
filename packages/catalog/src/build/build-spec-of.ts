/* @layer core @kind logic */
import type { SourceBuildJob } from '@archipelia/model';
import type { BuildSpec } from '@archipelia/engine';
import { toolsSpec, venvSpec, wheelSpec } from '@archipelia/engine';
import { cratesSpec } from './crates-spec';
import type { ActiveBuild, BuildDeps, BuildSession } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { JOB_PHASE } from './build-spec-of.constants';
import { confineBuild } from './confine-build';
import { parseBuildId } from './parse-build-id';

const specOf = (deps: Pick<BuildDeps, 'toolsDir'>, job: SourceBuildJob, build: ActiveBuild): Promise<BuildSpec> | BuildSpec => {
  if (job === 'venv') return venvSpec(build.runtime, build.dirs);
  if (job === 'tools') return toolsSpec(build.dirs);
  if (job === 'crates') return cratesSpec(deps, build);
  return wheelSpec(build.dirs);
};

const buildSpecOf = async (deps: Pick<BuildDeps, 'sandbox' | 'toolsDir'>, session: BuildSession, job: SourceBuildJob, raw: unknown): Promise<BuildSpec> => {
  const build = session.current();
  if (build?.id !== parseBuildId(raw) || !JOB_PHASE[job].includes(build.phase)) throw new Error(BUILD_TEXT.none);
  return confineBuild(deps, build, job, await specOf(deps, job, build));
};

export { buildSpecOf };
