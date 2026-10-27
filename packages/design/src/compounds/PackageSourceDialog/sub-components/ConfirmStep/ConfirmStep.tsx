/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const ConfirmStep = ({ view }: StepBodyProps) => {
  const { candidate, plan } = view;
  if (!candidate || !plan) return null;
  return (
    <Stack gap="md">
      <Callout tone="warning">{BUILD_TEXT.warning(candidate.id)}</Callout>
      <Text>{BUILD_TEXT.source(candidate.id, plan.pin.sha.slice(0, 7))}</Text>
      <Text tone="dim">{BUILD_TEXT.how}</Text>
    </Stack>
  );
};

export { ConfirmStep };
