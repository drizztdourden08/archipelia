/* @layer renderer-app @kind component */
import { openExternal, SearchAnchor } from '@drizztdourden08/brock-react';
import { Box, Button, ButtonRow, Callout, EmptyState, Flex, Grid, Icon, SearchInput, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useGameStore } from './behavior/useGameStore';
import type { GameStoreProps } from './GameStore.type';
import { GameCard } from '@archipelia/design';
import { cardPropsOf } from './behavior/card-props';
import { EMPTY_TEXT } from './GameStore.constants';
import { gameAnchor } from './behavior/game-anchor';
import './GameStore.css';

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
          <Button variant="secondary" loading={store.isBusy('load')} onClick={store.refresh} icon={<Icon name="refresh-cw" />}>Refresh index</Button>
          <Button variant="secondary" loading={store.isBusy('file')} onClick={store.addFromFile} icon={<Icon name="plus" />}>Add from file</Button>
        </ButtonRow>
      </Flex>
      {store.error && <Box role="alert"><Callout tone="danger">{store.error}</Callout></Box>}
      {store.visible.length === 0
        ? (
          <EmptyState icon={store.loading ? <Spinner /> : undefined} message={EMPTY_TEXT[store.empty]}
            action={store.empty === 'installed' ? <Button variant="primary" onClick={store.openOfficial}>Open Official</Button> : undefined} />
        )
        : (
          <Grid minColWidth={260} gap="md">
            {store.visible.slice(0, store.cards.shown).map((row) => (
              <SearchAnchor key={`${row.entry.source}:${row.entry.apworld}`} anchor={gameAnchor(row.entry.apworld)} className="game-store__anchor">
                <GameCard {...cardPropsOf(row, handlers)} />
              </SearchAnchor>
            ))}
          </Grid>
        )}
      {store.cards.hidden && (
        <Flex justify="center" align="center" gap="sm" wrap>
          <Text variant="caption">{`Showing ${store.cards.shown} of ${store.cards.total}: refine the search or show more.`}</Text>
          <Button variant="secondary" onClick={store.cards.showMore}>Show more</Button>
        </Flex>
      )}
    </Stack>
  );
};

export { GameStore };
