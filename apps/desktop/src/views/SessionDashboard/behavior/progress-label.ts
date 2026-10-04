/* @layer renderer-app @kind logic */
import type { JobSnapshot } from '@drizztdourden08/brock-core';

const progressLabel = (job: JobSnapshot | null) => (job?.state === 'running' ? `${Math.round(job.progress * 100)}%` : null);

export { progressLabel };
