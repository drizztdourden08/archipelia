/* @layer electron-main @kind logic */
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import { BUILD_JOB } from '@archipelia/model';
import type { BuildRunner } from '@archipelia/catalog';
import { buildRunOf } from './build-run-of';
import type { createBuildLines } from './create-build-lines';

const createBuildRunner = (processes: Pick<ProcessJobs, 'start'>, lines: ReturnType<typeof createBuildLines>): BuildRunner => async (job, buildId) => {
  const id = BUILD_JOB[job];
  lines.reset(id);
  return buildRunOf(await processes.start(id, { buildId }), lines.take(id));
};

export { createBuildRunner };
