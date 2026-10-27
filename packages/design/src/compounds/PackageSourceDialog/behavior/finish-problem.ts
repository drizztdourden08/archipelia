/* @layer renderer-app @kind logic */
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const finishProblem = ({ props, view }: Run, idle: string): string | null => {
  const { finish } = props;
  if (view.asking || finish.kind === 'done') return null;
  if (finish.kind === 'running') return STEP_TEXT.checkBusy;
  return finish.kind === 'idle' ? idle : STEP_TEXT.failedHeading;
};

export { finishProblem };
