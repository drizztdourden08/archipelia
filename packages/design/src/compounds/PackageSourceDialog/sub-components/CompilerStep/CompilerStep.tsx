/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const CompilerStep = ({ view }: StepBodyProps) => (
  <Stack gap="sm">
    <Text>{view.plan?.native ? PLAN_TEXT.compiler : PLAN_TEXT.compilerUnsure}</Text>
    <Text tone="dim">{PLAN_TEXT.manualIntro}</Text>
  </Stack>
);

export { CompilerStep };
