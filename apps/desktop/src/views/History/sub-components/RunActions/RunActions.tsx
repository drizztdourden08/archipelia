/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { LIVE, TEXT } from '../../History.constants';
import type { RunActionsProps } from './RunActions.type';

const RunActions = ({ run, sessionId, busy, onOpenRun, onOpenSession, onDelete }: RunActionsProps) => {
  const live = LIVE.has(run.status);
  return (
    <Stack gap="xs">
      <Flex gap="xs" wrap>
        <Button size="sm" variant="primary" icon={<Icon name="refresh-cw" />} disabled>Run again with this config</Button>
        <Button size="sm" variant="secondary" disabled={sessionId === null} onClick={() => onOpenSession(sessionId ?? '')}>Open session</Button>
        <Button size="sm" variant="secondary" aria-label={`${live ? 'Go to the tab of' : 'Open'} run ${run.snapshot.name}`} onClick={() => onOpenRun(run)}>{live ? 'Go to its tab' : 'Open run'}</Button>
        <Button size="sm" variant="danger" disabled={busy || live} aria-label={`Delete run ${run.snapshot.name}`} onClick={() => onDelete(run)}>Delete</Button>
      </Flex>
      <Text variant="caption">Run again with this config: {TEXT.runAgainSoon}.</Text>
    </Stack>
  );
};

export { RunActions };
