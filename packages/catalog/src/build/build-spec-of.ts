/* @layer core @kind logic */
import type { SourceBuildJob } from '@archipelia/model';
import type { BuildSpec } from '@archipelia/engine';
import { toolsSpec, venvSpec, wheelSpec } from '@archipelia/engine';
import type { BuildSession } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { JOB_PHASE } from './build-spec-of.constants';
import { parseBuildId } from './parse-build-id';

const buildSpecOf = (session: BuildSession, job: SourceBuildJob, raw: unknown): BuildSpec => {
  const build = session.current();
  if (build?.id !== parseBuildId(raw) || build.phase !== JOB_PHASE[job]) throw new Error(BUILD_TEXT.none);
  if (job === 'venv') return venvSpec(build.runtime, build.dirs);
  return job === 'tools' ? toolsSpec(build.dirs) : wheelSpec(build.dirs);
};

export { buildSpecOf };
