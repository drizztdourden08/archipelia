/* @layer renderer-app @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { PackageSourceDialogProps, SourceRoute, SourceValues } from '../PackageSourceDialog.type';
import { finishProblem } from './finish-problem';
import { runOf } from './run-of';
import { STEP_DESCRIPTION, STEP_LABEL, STEP_TEXT } from './step-text.constants';

const fetchStep = (props: PackageSourceDialogProps, route: SourceRoute, id: string): WizardStepDef<SourceValues> => ({
  id,
  label: route === 'wheel' ? STEP_LABEL.fetchWheel : STEP_LABEL.fetchPypi,
  description: route === 'wheel' ? STEP_DESCRIPTION.fetchWheel : STEP_DESCRIPTION.fetchPypi,
  when: (values) => runOf(props, values).view.route === route && values.route === route,
  validate: (values) => finishProblem(runOf(props, values), STEP_TEXT.fetchPending),
  busyHint: route === 'wheel' ? STEP_TEXT.fetchBusyWheel : STEP_TEXT.fetchBusyPypi,
});

const fetchSteps = (props: PackageSourceDialogProps): readonly WizardStepDef<SourceValues>[] => [
  fetchStep(props, 'wheel', 'fetch-wheel'),
  fetchStep(props, 'pypi', 'fetch-pypi'),
];

export { fetchSteps };
