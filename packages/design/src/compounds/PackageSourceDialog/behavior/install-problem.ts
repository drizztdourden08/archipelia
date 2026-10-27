/* @layer renderer-app @kind logic */
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const installProblem = ({ props, view }: Run): string | null => {
  if (view.asking) return STEP_TEXT.consentAsk;
  const { kind } = props.finish;
  if (kind === 'done') return null;
  return kind === 'running' ? STEP_TEXT.installBusy(props.module) : STEP_TEXT.installIdle;
};

export { installProblem };
