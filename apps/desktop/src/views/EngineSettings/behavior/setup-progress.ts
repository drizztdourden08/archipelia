/* @layer renderer-app @kind logic */
import type { JobSnapshot } from '@drizztdourden08/brock-core';
import { STARTING_STEP } from '../EngineSettings.constants';

const setupProgress = (job: JobSnapshot | null): { percent: number; step: string } | null => {
  if (job?.state !== 'running') return null;
  const step = job.steps.find((entry) => entry.id === job.currentStep)?.label ?? STARTING_STEP;
  return { percent: Math.round(job.progress * 100), step };
};

export { setupProgress };
