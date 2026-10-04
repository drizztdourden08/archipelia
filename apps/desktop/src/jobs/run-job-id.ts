/* @layer renderer-app @kind logic */
import { RUN_JOB_PREFIX } from './jobs.constants';

const runJobId = (sessionId: string): string => `${RUN_JOB_PREFIX}${sessionId}`;

export { runJobId };
