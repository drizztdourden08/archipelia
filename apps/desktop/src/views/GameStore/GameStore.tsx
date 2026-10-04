/* @layer renderer-app @kind component */
import { openExternal } from '@drizztdourden08/brock-react';
import { Box, Button, ButtonRow, Callout, EmptyState, Flex, Grid, Icon, SearchInput, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useGameStore } from './behavior/useGameStore';
import type { GameStoreProps } from './GameStore.type';
import { MAX_CARDS } from './GameStore.constants';
import { GameCard } from '@archipelia/design';
import { cardPropsOf } from './behavior/card-props';

const GameStore = ({ tab }: GameStoreProps) => {
  const store = useGameStore(tab);
  const handlers = { isBusy: store.isBusy, installWorld: store.installWorld, remove: store.remove, openHome: openExternal };

  return (
    <Stack>
      <Flex justify="between" align="center" wrap>
        {!(store.loading && store.rows.length === 0) && (
          <Text variant="caption">
            {store.rows.length} worlds · {store.installed.length} installed{store.catalog ? ` · index for AP ${store.catalog.apVersion}` : ''}
          </Text>
        )}
        <ButtonRow>
          <SearchInput placeholder="Search worlds" aria-label="Search worlds" value={store.query} onChange={store.setQuery} />
          <Button variant="secondary" disabled={store.isBusy()} onClick={store.refresh}><Icon name="refresh-cw" />Refresh index</Button>
          <Button variant="secondary" disabled={store.isBusy()} onClick={store.addFromFile}><Icon name="plus" />Add from file</Button>
        </ButtonRow>
      </Flex>
      {store.error && <Box role="alert"><Callout tone="danger">{store.error}</Callout></Box>}
      {store.visible.length === 0
        ? <EmptyState icon={store.loading ? <Spinner /> : undefined} message={store.loading ? 'Loading the catalog' : 'No world matches'} />
        : (
          <Grid minColWidth={260} gap="md">
            {store.visible.slice(0, MAX_CARDS).map((row) => <GameCard key={`${row.entry.source}:${row.entry.apworld}`} {...cardPropsOf(row, handlers)} />)}
          </Grid>
        )}
    </Stack>
  );
};

export { GameStore };
