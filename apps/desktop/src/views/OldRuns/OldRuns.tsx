/* @layer renderer-app @kind component */
import { ActionTile } from '@drizztdourden08/tessera/composites';
import { Grid, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { CLEAN_DAYS, TILE_MIN_COL } from './OldRuns.constants';
import { useOldRuns } from './behavior/useOldRuns';

const OldRuns = () => {
  const { busy, clean, error, kept, message, stale } = useOldRuns();
  return (
    <Stack>
      <Grid minColWidth={TILE_MIN_COL} gap="md">
        <ActionTile
          label="Old runs"
          icon="history"
          value={stale}
          unit={`older than ${CLEAN_DAYS} days`}
          meta={`${kept} ${kept === 1 ? 'run' : 'runs'} kept`}
          action={{ label: `Remove runs older than ${CLEAN_DAYS} days`, icon: 'trash-2', tone: 'danger', disabled: busy || stale === 0, onSelect: clean }}
        />
      </Grid>
      {error && <ErrorCallout message={error} />}
      {message && <Text variant="body" role="status">{message}</Text>}
    </Stack>
  );
};

export { OldRuns };
