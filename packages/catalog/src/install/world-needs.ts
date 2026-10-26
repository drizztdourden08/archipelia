/* @layer core @kind logic */
import type { InstallJob } from './commit-install.type';
import { needsOf } from './needs-of';

const worldNeeds = (job: InstallJob, label: string) =>
  (job.source === 'official' ? Promise.resolve({ wheels: [], declared: [] }) : needsOf(job.runtime, job.info, label, job.wheels));

export { worldNeeds };
