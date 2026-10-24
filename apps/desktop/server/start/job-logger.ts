/* @layer server @kind logic */
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import type { ServerLog } from '@drizztdourden08/brock-electron/server';
import type { Seen } from './job-logger.type';

const jobLogger = (log: ServerLog) => {
  const seen = new Map<string, Seen>();
  return (job: JobSnapshot): void => {
    const last = seen.get(job.id) ?? { lines: 0, step: null, state: 'running' };
    const label = job.steps.find((step) => step.id === job.currentStep)?.label;
    if (job.currentStep !== last.step && label) log(`${job.title}: ${label}`);
    for (const line of job.log.slice(last.lines)) log(`${job.title}: ${line.message}`, line.level);
    if (job.state !== last.state) log(`${job.title}: ${job.state}${job.error ? `: ${job.error}` : ''}`, job.state === 'failed' ? 'error' : 'info');
    seen.set(job.id, { lines: job.log.length, step: job.currentStep, state: job.state });
  };
};

export { jobLogger };
