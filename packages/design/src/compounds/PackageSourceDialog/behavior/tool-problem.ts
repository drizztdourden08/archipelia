/* @layer renderer-app @kind logic */
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const toolProblem = ({ props, view }: Run): string | null => {
  const kind = view.stage?.kind;
  if (kind === 'missing' || kind === 'paused') return STEP_TEXT.toolWait;
  if (kind === 'failed') return STEP_TEXT.failedHeading;
  return kind === 'installing' || (kind === 'building' && props.finish.kind === 'idle') ? STEP_TEXT.toolBusy : null;
};

export { toolProblem };
