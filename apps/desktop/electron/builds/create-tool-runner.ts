/* @layer electron-main @kind logic */
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import { TOOL_JOB } from '@archipelia/model';
import type { ToolRunner } from '@archipelia/catalog';
import { buildRunOf } from './build-run-of';
import type { createBuildLines } from './create-build-lines';

const createToolRunner = (processes: Pick<ProcessJobs, 'start'>, lines: ReturnType<typeof createBuildLines>): ToolRunner => async (elevation, tool) => {
  const id = TOOL_JOB[elevation];
  lines.reset(id);
  return buildRunOf(await processes.start(id, { tool }), lines.take(id));
};

export { createToolRunner };
