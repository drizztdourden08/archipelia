/* @layer renderer-app @kind config */
import type { RadioOption } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { SourceHow } from '../../PackageSourceDialog.type';

const HOW_OPTIONS: RadioOption<SourceHow>[] = [
  { value: 'build', label: STEP_TEXT.howBuild, description: STEP_TEXT.howBuildHelp },
  { value: 'myself', label: STEP_TEXT.howMyself, description: STEP_TEXT.howMyselfHelp },
];

export { HOW_OPTIONS };
