/* @layer renderer-app @kind component */
import { Card, Flex, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { RetryButton } from '@drizztdourden08/tessera/composites';
import { CONNECTION_STATUS, RETRY_PHASES } from './ConnectionStatus.constants';
import type { ConnectionStatusProps } from './ConnectionStatus.type';

const ConnectionStatus = (props: ConnectionStatusProps) => {
  const { phase, detail, auth, onRetry, retryAt, attempt, attempts, retrying } = props;
  const retryable = onRetry !== undefined && RETRY_PHASES.has(phase);
  return (
    <Card>
      <Stack gap="sm">
        <Flex justify="between" align="center" wrap gap="sm">
          <Stack gap="xs">
            <Status map={CONNECTION_STATUS} value={phase} dot role="status" />
            {detail && <Text variant="caption">{detail}</Text>}
          </Stack>
          {retryable && <RetryButton onRetry={onRetry} retryAt={retryAt} attempt={attempt} attempts={attempts} retrying={retrying} />}
        </Flex>
        {phase === 'password' && auth}
      </Stack>
    </Card>
  );
};

export { ConnectionStatus };
