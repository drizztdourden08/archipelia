/* @layer renderer-app @kind component */
import { Callout, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const WhyStep = ({ dialog }: StepBodyProps) => (
  <Stack gap="md">
    <Callout tone="danger" icon={<Icon name="circle-alert" />} title={STEP_TEXT.whyHeading(dialog.module)}>{STEP_TEXT.whyBody}</Callout>
    <Text tone="dim">{STEP_TEXT.whyPlan}</Text>
  </Stack>
);

export { WhyStep };
