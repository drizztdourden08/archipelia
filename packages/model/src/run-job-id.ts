/* @layer core @kind logic */
import { RUN_JOB_PREFIX } from './shared-ids.constants';

const runJobId = (sessionId: string): string => `${RUN_JOB_PREFIX}${sessionId}`;

export { runJobId };
