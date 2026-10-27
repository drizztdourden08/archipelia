/* @layer renderer-app @kind component */
import { RadioGroup } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { HOW_OPTIONS } from './HowStep.constants';

const HowStep = ({ wizard }: StepBodyProps) => (
  <RadioGroup label={STEP_TEXT.howLegend} value={wizard.values.how} options={HOW_OPTIONS} onChange={(how) => wizard.update({ how })} />
);

export { HowStep };
