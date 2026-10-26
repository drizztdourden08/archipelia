/* @layer renderer-app @kind component */
import { openExternal, SearchAnchor } from '@drizztdourden08/brock-react';
import { Box, Button, EmptyState, Icon, IconButton, Spinner, Tooltip } from '@drizztdourden08/tessera/primitives';
import { FilterBar, VirtualGrid } from '@drizztdourden08/tessera/composites';
import type { VirtualGridHandle } from '@drizztdourden08/tessera/composites';
import { ErrorCallout, PackageConsentDialog, PackageSourceDialog } from '@archipelia/design';
import { useMemo, useRef, useState } from 'react';
import { gameAnchor } from './behavior/game-anchor';
import { GAME_FIELDS } from './behavior/game-schema.constants';
import { gridSectionsOf } from './behavior/grid-sections-of';
import { rowKey } from './behavior/row-key';
import { useGameStore } from './behavior/useGameStore';
import { useCardHandlers } from './behavior/useCardHandlers';
import { useRevealGame } from './behavior/useRevealGame';
import { EMPTY_TEXT, TILE } from './GameStore.constants';
import type { GameStoreProps } from './GameStore.type';
import { GameDetailsDialog } from './sub-components/GameDetailsDialog';
import { GameRowCard } from './sub-components/GameRowCard';
import { GameStatusBar } from './sub-components/GameStatusBar';
import { SectionLabel } from './sub-components/SectionLabel';
import './GameStore.css';

const GameStore = ({ tab }: GameStoreProps) => {
  const store = useGameStore(tab);
  const [opened, setOpened] = useState<string | null>(null);
  const { handlers, sourceDialog } = useCardHandlers({ store, setOpened });
  const sections = useMemo(() => gridSectionsOf(store.sections, tab, store.filtered), [store.sections, tab, store.filtered]);
  const grid = useRef<VirtualGridHandle>(null);
  useRevealGame(sections, grid);
  const openRow = opened === null ? undefined : store.rows.find((row) => rowKey(row) === opened);

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
      <Box className="game-store__body">
        {store.shown === 0
          ? (
            <EmptyState icon={store.loading ? <Spinner /> : undefined} message={EMPTY_TEXT[store.empty]}
              action={store.empty === 'installed' ? <Button variant="primary" onClick={store.openOfficial}>Open Official</Button> : undefined} />
          )
          : (
            <VirtualGrid
              ref={grid}
              label="Games"
              tileWidth={TILE.width}
              tileHeight={TILE.height}
              sections={sections.map(({ id, rows }) => ({ key: id, label: <SectionLabel id={id} empty={rows.length === 0} />, items: rows }))}
              getKey={rowKey}
              renderItem={(row) => (
                <SearchAnchor anchor={gameAnchor(row.entry.apworld)} className="game-store__anchor">
                  <GameRowCard row={row} handlers={handlers} />
                </SearchAnchor>
              )}
            />
          )}
      </Box>
      {sourceDialog && <PackageSourceDialog {...sourceDialog} />}
      {store.consent.pending && (
        <PackageConsentDialog {...store.consent.pending} onAccept={store.consent.accept} onCancel={store.consent.cancel} onOpenLink={openExternal} />
      )}
      {openRow && <GameDetailsDialog row={openRow} handlers={handlers} onClose={() => setOpened(null)} />}
      <GameStatusBar summary={store.summary} loading={store.loading} filtered={store.filtered} adding={store.isBusy('file')} onAddFromFile={store.addFromFile} />
    </Box>
  );
};

export { GameStore };
