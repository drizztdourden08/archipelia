/* @layer renderer-app @kind component */
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const PipStep = ({ dialog, view }: StepBodyProps) => {
  const { plan } = view;
  if (!plan) return null;
  return (
    <Stack gap="sm">
      <Text>{PLAN_TEXT.python}</Text>
      <Text mono variant="caption">{plan.python}</Text>
      <Text>{PLAN_TEXT.install(dialog.module)}</Text>
      <CodeBlock code={plan.command} language="text" copyable wrap />
      {plan.python.includes('\\') && <Text variant="caption" tone="dim">{PLAN_TEXT.shell}</Text>}
    </Stack>
  );
};

export { PipStep };
