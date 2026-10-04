/* @layer renderer-app @kind component */
import { Button, ButtonRow, Card, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { CLEAN_DAYS } from './OldRuns.constants';
import { useOldRuns } from './behavior/useOldRuns';

const OldRuns = () => {
  const { busy, clean, error, kept, message, stale } = useOldRuns();
  return (
    <Stack>
      <Card>
        <Stack gap="xs">
          <Text variant="body">{kept} runs kept, {stale} older than {CLEAN_DAYS} days.</Text>
          <ButtonRow align="start">
            <Button variant="danger" disabled={busy || stale === 0} onClick={clean} icon={<Icon name="trash-2" />}>Remove runs older than {CLEAN_DAYS} days</Button>
          </ButtonRow>
        </Stack>
      </Card>
      {error && <ErrorCallout message={error} />}
      {message && <Text variant="body" role="status">{message}</Text>}
    </Stack>
  );
};

export { OldRuns };
