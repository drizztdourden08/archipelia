/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { FilterBar } from '@drizztdourden08/tessera/composites';
import { SpoilerTracker } from '@archipelia/design';
import { controlsOf } from '../../behavior/controls-of';
import { useSpoilerBoard } from '../../behavior/useSpoilerBoard';
import type { SpoilerTab } from '../../SpoilerWidget.type';
import { SpoilerBody } from '../SpoilerBody';
import type { SpoilerLoadedProps } from './SpoilerLoaded.type';

const SpoilerLoaded = ({ log, types, text, onHide }: SpoilerLoadedProps) => {
  const { state, fields, root, stats, tabs, total, shown } = useSpoilerBoard(log, types);
  const searching = state.tab === 'placements';
  const filters = searching
    ? (
      <FilterBar
        search={state.query}
        onSearchChange={state.setQuery}
        searchPlaceholder="Search location, item or slot"
        searchLabel="Search the spoiler"
        schema={fields}
        clauses={state.clauses}
        onChange={state.setClauses}
      />
    )
    : undefined;
  return (
    <SpoilerTracker
      stats={stats}
      tabs={tabs}
      activeTab={state.tab}
      onTabChange={(tab) => state.setTab(tab as SpoilerTab)}
      actions={<Button size="sm" variant="secondary" icon={<Icon name="eye-off" />} onClick={onHide}>Hide spoiler</Button>}
      filters={filters}
      controls={controlsOf(state)}
      subtotal={searching && shown !== total ? `${shown} of ${total} placements match` : undefined}
    >
      <SpoilerBody log={log} text={text} root={root} state={state} />
    </SpoilerTracker>
  );
};

export { SpoilerLoaded };
