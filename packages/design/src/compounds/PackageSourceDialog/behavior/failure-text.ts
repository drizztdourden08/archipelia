/* @layer renderer-app @kind logic */
import type { SourceFinish } from '../PackageSourceDialog.type';
import { STEP_TEXT } from './step-text.constants';

const failureText = (finish: SourceFinish): string | undefined => {
  if (finish.kind === 'missing') return `${STEP_TEXT.checkMissing(finish.names.join(', '))} ${STEP_TEXT.checkMissingHelp}`;
  return finish.kind === 'failed' ? finish.message : undefined;
};

export { failureText };
