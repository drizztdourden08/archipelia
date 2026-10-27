/* @layer renderer-app @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { PackageSourceDialogProps, SourceValues } from '../PackageSourceDialog.type';
import { buildSteps } from './build-steps';
import { headSteps } from './head-steps';
import { myselfSteps } from './myself-steps';
import { fetchSteps } from './fetch-steps';
import { tailSteps } from './tail-steps';

const sourceSteps = (props: PackageSourceDialogProps): readonly WizardStepDef<SourceValues>[] => [
  ...headSteps(props),
  ...fetchSteps(props),
  ...buildSteps(props),
  ...myselfSteps(props),
  ...tailSteps(props),
];

export { sourceSteps };
