/* @layer electron-main @kind logic */
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import { BUILD_JOB } from '@archipelia/model';
import type { BuildRunner } from '@archipelia/catalog';
import { buildRunOf } from './build-run-of';
import { readBuildLog } from './read-build-log';

const createBuildRunner = (processes: Pick<ProcessJobs, 'start'>): BuildRunner => async (job, buildId) => {
  const outcome = await processes.start(BUILD_JOB[job], { buildId });
  const logFile = outcome.status === 'rejected' ? undefined : outcome.logFile;
  return buildRunOf(outcome, await readBuildLog(logFile));
};

export { createBuildRunner };
