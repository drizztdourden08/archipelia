/* @layer electron-main @kind logic */
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import { TOOL_JOB } from '@archipelia/model';
import type { ToolRunner } from '@archipelia/catalog';
import { buildRunOf } from './build-run-of';
import { TOOL_DETACHED } from './builds.constants';
import { readBuildLog } from './read-build-log';

const createToolRunner = (processes: Pick<ProcessJobs, 'start'>): ToolRunner => async (elevation, tool) => {
  const outcome = await processes.start(TOOL_JOB[elevation], { tool });
  const logFile = outcome.status === 'rejected' ? undefined : outcome.logFile;
  const run = buildRunOf(outcome, await readBuildLog(logFile));
  return outcome.status === 'detached' ? { ...run, error: TOOL_DETACHED } : run;
};

export { createToolRunner };
