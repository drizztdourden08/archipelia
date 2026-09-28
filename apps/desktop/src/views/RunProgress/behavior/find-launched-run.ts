/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { RunLaunch } from '../RunProgress.type';
import { CLOCK_SLACK_MS } from '../RunProgress.constants';

const findLaunchedRun = (runs: Session[], launch: RunLaunch): Session | undefined => {
  if (launch.sessionId) return runs.find((run) => run.id === launch.sessionId);
  if (!launch.templateId) return undefined;
  return runs
    .filter((run) => run.templateId === launch.templateId && run.createdAt >= launch.startedAt - CLOCK_SLACK_MS)
    .sort((a, b) => a.createdAt - b.createdAt)[0];
};

export { findLaunchedRun };
