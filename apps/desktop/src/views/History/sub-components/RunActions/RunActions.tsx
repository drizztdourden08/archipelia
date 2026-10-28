/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { LIVE, TEXT } from '../../History.constants';
import type { RunActionsProps } from './RunActions.type';

const againReason = (gone: boolean, live: boolean): string | undefined => {
  if (gone) return TEXT.runAgainGone;
  return live ? TEXT.runAgainLive : undefined;
};

const RunActions = ({ run, sessionId, busy, onOpenRun, onOpenSession, onRunAgain, onDelete }: RunActionsProps) => {
  const live = LIVE.has(run.status);
  const reason = againReason(sessionId === null, live);
  return (
    <Stack gap="xs">
      <Flex gap="xs" wrap>
        <Button size="sm" variant="primary" icon={<Icon name="refresh-cw" />} disabled={busy || reason !== undefined} onClick={() => onRunAgain(run)}>Run again with this config</Button>
        <Button size="sm" variant="secondary" disabled={sessionId === null} onClick={() => onOpenSession(sessionId ?? '')}>Open session</Button>
        <Button size="sm" variant="secondary" aria-label={`${live ? 'Go to the tab of' : 'Open'} run ${run.snapshot.name}`} onClick={() => onOpenRun(run)}>{live ? 'Go to its tab' : 'Open run'}</Button>
        <Button size="sm" variant="danger" disabled={busy || live} aria-label={`Delete run ${run.snapshot.name}`} onClick={() => onDelete(run)}>Delete</Button>
      </Flex>
      {reason && <Text variant="caption">{`Run again with this config: ${reason}`}</Text>}
    </Stack>
  );
};

export { RunActions };
