/* @layer renderer-app @kind component */
import { openExternal } from '@drizztdourden08/brock-react';
import { Box, EmptyState, Icon, IconButton, ScrollArea, Spinner, Stack, Tooltip } from '@drizztdourden08/tessera/primitives';
import { FilterBar } from '@drizztdourden08/tessera/composites';
import { ErrorCallout } from '@archipelia/design';
import { useGameStore } from './behavior/useGameStore';
import { GAME_FIELDS } from './behavior/game-schema.constants';
import { EMPTY_TEXT } from './GameStore.constants';
import { GameSection } from './sub-components/GameSection';
import { GameStatusBar } from './sub-components/GameStatusBar';
import './GameStore.css';

const GameStore = () => {
  const store = useGameStore();
  const handlers = { isBusy: store.isBusy, installWorld: store.installWorld, remove: store.remove, openHome: openExternal };
  const resetKey = `${store.query}:${store.filters.length}`;

  return (
    <Box className="game-store">
      <Box data-tour="game-store-tools">
        <FilterBar
          search={store.query}
          onSearchChange={store.setQuery}
          searchPlaceholder="Search worlds"
          searchLabel="Search worlds"
          schema={GAME_FIELDS}
          clauses={store.filters}
          onChange={store.setFilters}
          extra={(
            <Tooltip content="Refresh the index" placement="bottom">
              <IconButton size="sm" variant="ghost" label="Refresh index" loading={store.isBusy('load')} onClick={store.refresh}><Icon name="refresh-cw" /></IconButton>
            </Tooltip>
          )}
        />
      </Box>
      {store.error && <ErrorCallout message={store.error} onRetry={store.loadFailed ? store.retry : undefined} />}
      <ScrollArea scrollbar="slim" className="game-store__body">
        {store.visible.length === 0
          ? <EmptyState icon={store.loading ? <Spinner /> : undefined} message={EMPTY_TEXT[store.empty]} />
          : (
            <Stack gap="lg">
              {store.sections.map((section) => (
                <GameSection key={section.id} section={section} resetKey={resetKey} filtered={store.filtered} handlers={handlers} />
              ))}
            </Stack>
          )}
      </ScrollArea>
      <GameStatusBar summary={store.summary} loading={store.loading} filtered={store.filtered} adding={store.isBusy('file')} onAddFromFile={store.addFromFile} />
    </Box>
  );
};

export { GameStore };
