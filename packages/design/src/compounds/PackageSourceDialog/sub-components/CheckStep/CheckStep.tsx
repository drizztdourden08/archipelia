/* @layer renderer-app @kind component */
import { Box, Button, Callout, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { failureText } from '../../behavior/failure-text';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { PLAN_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';

const CheckStep = ({ dialog }: StepBodyProps) => {
  const { finish } = dialog;
  const problem = failureText(finish);
  return (
    <Stack gap="md">
      <Text>{STEP_TEXT.checkIntro(dialog.module)}</Text>
      <Button variant="primary" icon={<Icon name="refresh-cw" />} loading={finish.kind === 'running'} onClick={dialog.onCheckAgain}>{PLAN_TEXT.checkAgain}</Button>
      {problem && <Box role="status"><Callout tone="warning">{problem}</Callout></Box>}
      {finish.kind === 'done' && <Box role="status"><Callout tone="success">{STEP_TEXT.checkOk}</Callout></Box>}
    </Stack>
  );
};

export { CheckStep };
