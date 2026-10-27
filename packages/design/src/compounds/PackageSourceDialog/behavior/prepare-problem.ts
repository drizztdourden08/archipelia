/* @layer renderer-app @kind logic */
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const prepareProblem = ({ view }: Run): string | null => {
  const kind = view.stage?.kind;
  if (kind === 'failed') return STEP_TEXT.failedHeading;
  return kind === 'preparing' || kind === undefined ? STEP_TEXT.prepareBusy : null;
};

export { prepareProblem };
