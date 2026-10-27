/* @layer renderer-app @kind component */
import { CopyButton } from '@drizztdourden08/tessera/composites';
import { Button, Callout, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { BuildLog } from '../BuildLog';
import type { FailurePanelProps } from './FailurePanel.type';

const FailurePanel = ({ message, log = [], onRetry }: FailurePanelProps) => (
  <Stack gap="md">
    <Callout tone="danger" icon={<Icon name="circle-alert" />} title={STEP_TEXT.failedHeading}>
      <Stack gap="xs">
        <Text>{message}</Text>
        <Text tone="dim">{STEP_TEXT.failedHelp}</Text>
      </Stack>
    </Callout>
    <Flex gap="sm" wrap>
      {onRetry && <Button variant="primary" icon={<Icon name="refresh-cw" />} onClick={onRetry}>{STEP_TEXT.tryAgain}</Button>}
      <CopyButton text={[message, ...log].join('\n')} label={STEP_TEXT.copyLog} showLabel variant="secondary" />
    </Flex>
    {log.length > 0 && <BuildLog lines={log} label={undefined} />}
  </Stack>
);

export { FailurePanel };
