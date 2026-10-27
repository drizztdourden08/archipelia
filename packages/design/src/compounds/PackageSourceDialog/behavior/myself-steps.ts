/* @layer renderer-app @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { finishProblem } from './finish-problem';
import { runOf } from './run-of';
import { STEP_DESCRIPTION, STEP_LABEL, STEP_TEXT } from './step-text.constants';

const onMyselfPath = (props: PackageSourceDialogProps, values: SourceValues): boolean =>
  runOf(props, values).view.route === 'source' && values.how === 'myself';

const needsCompiler = (props: PackageSourceDialogProps, values: SourceValues): boolean => {
  const { plan } = runOf(props, values).view;
  return onMyselfPath(props, values) && plan !== undefined && (plan.native || plan.unsure);
};

const myselfSteps = (props: PackageSourceDialogProps): readonly WizardStepDef<SourceValues>[] => [
  { id: 'compiler', label: STEP_LABEL.compiler, description: STEP_DESCRIPTION.compiler, when: (values) => needsCompiler(props, values) },
  { id: 'git', label: STEP_LABEL.git, description: STEP_DESCRIPTION.git, when: (values) => onMyselfPath(props, values) },
  { id: 'pip', label: STEP_LABEL.pip, description: STEP_DESCRIPTION.pip, when: (values) => onMyselfPath(props, values) },
  {
    id: 'check',
    label: STEP_LABEL.check,
    description: STEP_DESCRIPTION.check,
    when: (values) => onMyselfPath(props, values),
    validate: (values) => finishProblem(runOf(props, values), STEP_TEXT.checkPending),
    busyHint: STEP_TEXT.checkBusy,
  },
];

export { myselfSteps };
