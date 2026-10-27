/* @layer renderer-app @kind logic */
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const buildProblem = ({ props, view }: Run): string | null => {
  const kind = view.stage?.kind;
  if (kind === 'failed') return STEP_TEXT.failedHeading;
  if (kind === 'ready') return STEP_TEXT.buildIdle;
  return kind === 'building' && props.finish.kind === 'idle' ? STEP_TEXT.toolBusy : null;
};

export { buildProblem };
