/* @layer renderer-app @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { foundProblem } from './found-problem';
import { runOf } from './run-of';
import { sourceProblem } from './source-problem';
import { STEP_DESCRIPTION, STEP_LABEL, STEP_TEXT } from './step-text.constants';

const headSteps = (props: PackageSourceDialogProps): readonly WizardStepDef<SourceValues>[] => [
  { id: 'why', label: STEP_LABEL.why, description: STEP_DESCRIPTION.why },
  {
    id: 'source',
    label: STEP_LABEL.source,
    description: STEP_DESCRIPTION.source,
    validate: (values) => sourceProblem(runOf(props, values), values),
    summary: (values) => runOf(props, values).view.candidate?.id,
  },
  {
    id: 'found',
    label: STEP_LABEL.found,
    description: STEP_DESCRIPTION.found,
    validate: (values) => foundProblem(runOf(props, values), values),
  },
  {
    id: 'how',
    label: STEP_LABEL.how,
    description: STEP_DESCRIPTION.how,
    when: (values) => runOf(props, values).view.route === 'source',
    validate: (values) => (values.how ? null : STEP_TEXT.howPick),
  },
];

export { headSteps };
