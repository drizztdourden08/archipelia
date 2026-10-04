/* @layer electron-main @kind logic */
import type { EngineProgress } from '@archipelia/model';
import type { RunStepAt } from './run-jobs.type';
import { ENGINE_STEPS, STAGE_LINES } from './run-steps.constants';

const countsOf = ({ done, total, stage }: EngineProgress) =>
  (done !== undefined && total ? ` · ${done} / ${total}${stage === 'fill' ? ' items' : ''}` : '');

const shareOf = ({ done, total }: EngineProgress) => (done !== undefined && total ? Math.min(1, Math.max(0, done / total)) : 0);

const runStepAt = (progress: EngineProgress): RunStepAt => {
  const step = ENGINE_STEPS.find((entry) => entry.stages.includes(progress.stage)) ?? ENGINE_STEPS[0];
  const stages = step?.stages ?? [progress.stage];
  const index = Math.max(0, stages.indexOf(progress.stage));
  return {
    step: step?.id ?? progress.stage,
    fraction: (index + shareOf(progress)) / stages.length,
    line: `${STAGE_LINES[progress.stage]}${countsOf(progress)}`,
  };
};

export { runStepAt };
