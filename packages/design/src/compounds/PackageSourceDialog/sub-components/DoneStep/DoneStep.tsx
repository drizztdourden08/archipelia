/* @layer renderer-app @kind component */
import { Callout, Icon } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const DoneStep = ({ dialog }: StepBodyProps) => (
  <Callout tone="success" icon={<Icon name="check" />}>{STEP_TEXT.doneText(dialog.title)}</Callout>
);

export { DoneStep };
