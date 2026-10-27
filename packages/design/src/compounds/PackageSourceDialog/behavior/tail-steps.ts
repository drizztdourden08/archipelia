/* @layer renderer-app @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { consentProblem } from './consent-problem';
import { installProblem } from './install-problem';
import { runOf } from './run-of';
import { STEP_DESCRIPTION, STEP_LABEL, STEP_TEXT } from './step-text.constants';

const tailSteps = (props: PackageSourceDialogProps): readonly WizardStepDef<SourceValues>[] => [
  {
    id: 'consent',
    label: STEP_LABEL.consent,
    description: STEP_DESCRIPTION.consent,
    validate: (values) => consentProblem(runOf(props, values)),
    buttons: { next: { label: STEP_TEXT.consentButton, icon: 'download' } },
  },
  {
    id: 'install',
    label: STEP_LABEL.install,
    description: STEP_DESCRIPTION.install,
    validate: (values) => installProblem(runOf(props, values)),
    busyHint: STEP_TEXT.installBusy(props.module),
  },
  {
    id: 'done',
    label: STEP_LABEL.done,
    description: STEP_DESCRIPTION.done,
    buttons: { cancel: false, next: { label: STEP_TEXT.doneButton, icon: 'check' } },
  },
];

export { tailSteps };
