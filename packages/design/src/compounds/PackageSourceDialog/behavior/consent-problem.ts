/* @layer renderer-app @kind logic */
import { STEP_TEXT } from './step-text.constants';
import type { Run } from './step-problems.type';

const consentProblem = ({ props, view }: Run): string | null => (view.asking || props.finish.kind !== 'running' ? null : STEP_TEXT.consentWait);

export { consentProblem };
