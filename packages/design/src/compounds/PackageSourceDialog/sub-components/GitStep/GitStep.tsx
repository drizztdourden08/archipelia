/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const GitStep = ({ view }: StepBodyProps) => (
  <Stack gap="sm">
    <Text>{PLAN_TEXT.git}</Text>
    {view.plan?.submodules && <Text tone="dim">{PLAN_TEXT.submodules}</Text>}
  </Stack>
);

export { GitStep };
