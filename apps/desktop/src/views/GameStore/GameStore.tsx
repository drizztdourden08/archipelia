/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Button, ButtonRow, EmptyState, Flex, Grid, Stack, TabBar, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useGameStore } from './behavior/useGameStore';
import type { GameTab } from './GameStore.type';
import { MAX_CARDS } from './GameStore.constants';
import { GameCard } from '../../compounds/GameCard';
import { cardPropsOf } from './behavior/card-props';

const GameStore = () => {
  const store = useGameStore();
  const openHome = useCallback((url: string) => { window.open(url, '_blank', 'noopener'); }, []);
  const tabs = useMemo(() => [
    { id: 'installed', label: 'Installed', badge: store.rows.filter((r) => r.state !== 'available').length },
    { id: 'official', label: 'Official', badge: store.rows.filter((r) => r.entry.source === 'official').length },
    { id: 'community', label: 'Community', badge: store.rows.filter((r) => r.entry.source === 'index').length },
    { id: 'updates', label: 'Updates', badge: store.rows.filter((r) => r.state === 'update').length },
  ], [store.rows]);
  const handlers = { busy: store.busy, installWorld: store.installWorld, remove: store.remove, openHome };

  return (
    <Stack>
      <Flex justify="between" align="center" wrap>
        <Stack gap="xs">
          <Text as="h1" variant="title">Games</Text>
          <Text variant="caption">
            {store.rows.length} worlds · {store.installed.length} installed{store.catalog ? ` · index for AP ${store.catalog.apVersion}` : ''}
          </Text>
        </Stack>
        <ButtonRow>
          <TextInput placeholder="Search worlds" value={store.query} onChange={(e) => store.setQuery(e.target.value)} />
          <Button variant="secondary" disabled={store.busy !== null} onClick={store.refresh}>Refresh index</Button>
          <Button variant="secondary" disabled={store.busy !== null} onClick={store.addFromFile}>Add from file</Button>
        </ButtonRow>
      </Flex>
      <TabBar tabs={tabs} activeTab={store.tab} onTabChange={(id) => store.setTab(id as GameTab)} />
      {store.error && <Text variant="body" role="alert">{store.error}</Text>}
      {store.visible.length === 0
        ? <EmptyState message={store.busy === 'load' ? 'Loading the catalog' : 'No world matches'} />
        : (
          <Grid minColWidth={260} gap="md">
            {store.visible.slice(0, MAX_CARDS).map((row) => <GameCard key={`${row.entry.source}:${row.entry.apworld}`} {...cardPropsOf(row, handlers)} />)}
          </Grid>
        )}
    </Stack>
  );
};

export { GameStore };
