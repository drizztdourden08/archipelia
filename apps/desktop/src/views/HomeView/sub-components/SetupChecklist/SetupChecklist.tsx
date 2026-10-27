/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import type { SetupChecklistProps } from './SetupChecklist.type';
import { SetupStepRow } from '../SetupStepRow';

const SetupChecklist = ({ steps, onStep }: SetupChecklistProps) => (
  <Stack gap="sm" data-tour={TOUR_TARGET.homeAside}>
    <Text variant="label">Before the first run</Text>
    <Stack gap="sm" role="list" aria-label="Setup steps">
      {steps.map((step, index) => <SetupStepRow key={step.id} step={step} index={index} onStep={onStep} />)}
    </Stack>
  </Stack>
);

export { SetupChecklist };
