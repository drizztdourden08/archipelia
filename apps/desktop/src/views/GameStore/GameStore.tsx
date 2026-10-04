/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, EmptyState, Flex, Grid, Icon, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useGameStore } from './behavior/useGameStore';
import type { GameStoreProps } from './GameStore.type';
import { MAX_CARDS } from './GameStore.constants';
import { GameCard } from '@archipelia/design';
import { cardPropsOf } from './behavior/card-props';

const GameStore = ({ tab }: GameStoreProps) => {
  const store = useGameStore(tab);
  const openHome = useCallback((url: string) => { window.open(url, '_blank', 'noopener'); }, []);
  const handlers = { isBusy: store.isBusy, installWorld: store.installWorld, remove: store.remove, openHome };

  return (
    <Stack>
      <Flex justify="between" align="center" wrap>
        <Text variant="caption">
          {store.rows.length} worlds · {store.installed.length} installed{store.catalog ? ` · index for AP ${store.catalog.apVersion}` : ''}
        </Text>
        <ButtonRow>
          <TextInput placeholder="Search worlds" value={store.query} onChange={(e) => store.setQuery(e.target.value)} />
          <Button variant="secondary" disabled={store.isBusy()} onClick={store.refresh}><Icon name="refresh-cw" />Refresh index</Button>
          <Button variant="secondary" disabled={store.isBusy()} onClick={store.addFromFile}><Icon name="plus" />Add from file</Button>
        </ButtonRow>
      </Flex>
      {store.error && <Text variant="body" role="alert">{store.error}</Text>}
      {store.visible.length === 0
        ? <EmptyState message={store.isBusy('load') ? 'Loading the catalog' : 'No world matches'} />
        : (
          <Grid minColWidth={260} gap="md">
            {store.visible.slice(0, MAX_CARDS).map((row) => <GameCard key={`${row.entry.source}:${row.entry.apworld}`} {...cardPropsOf(row, handlers)} />)}
          </Grid>
        )}
    </Stack>
  );
};

export { GameStore };
