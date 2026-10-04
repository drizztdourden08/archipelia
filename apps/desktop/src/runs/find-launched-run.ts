/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { RunLaunch } from './run-launch.type';
import { CLOCK_SLACK_MS } from './runs.constants';

const findLaunchedRun = (runs: Session[], launch: RunLaunch): Session | undefined => runs
  .filter((run) => run.templateId === launch.templateId && run.createdAt >= launch.startedAt - CLOCK_SLACK_MS)
  .sort((a, b) => a.createdAt - b.createdAt)[0];

export { findLaunchedRun };
