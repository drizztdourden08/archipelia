/* @layer core @kind logic */
import type { SourceBuildEnd, SourceBuildJob } from '@archipelia/model';
import { stripPaths } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps } from './build.type';
import { BUILD_TEXT, STEP_FAILED } from './build-text.constants';
import { MAX_LOG_LINES } from './build.constants';
import { classifyBuildFailure } from './classify-build-failure';

const runStep = async (deps: BuildDeps, build: ActiveBuild, job: SourceBuildJob): Promise<SourceBuildEnd | undefined> => {
  if (!deps.run) throw new Error(BUILD_TEXT.desktopOnly);
  build.controller.signal.throwIfAborted();
  deps.log?.(`build: ${job} step started`);
  const run = await deps.run(job, build.id);
  deps.log?.(`build: ${job} step ${run.status}${run.code === null ? '' : ` with code ${run.code}`}`);
  if (run.status === 'done') return undefined;
  if (run.status === 'cancelled') return { status: 'cancelled' };
  const log = run.lines.slice(-MAX_LOG_LINES).map(stripPaths);
  const missing = job === 'wheel' ? classifyBuildFailure(run.lines) : undefined;
  if (missing) return { status: 'missing', missing, log };
  return { status: 'failed', message: STEP_FAILED[job], log, retry: true };
};

export { runStep };
