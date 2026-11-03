/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import type { SpoilerView } from '@archipelia/design';
import { NO_CLAUSES, NO_OPEN, NONE } from '../SpoilerWidget.constants';
import type { GroupBy, SpoilerTab } from '../SpoilerWidget.type';

const useSpoilerState = () => {
  const [tab, setTab] = useWidgetState<SpoilerTab>('tab', 'placements');
  const [clauses, setClauses] = useWidgetState<readonly FilterClause[]>('filters', NO_CLAUSES);
  const [query, setQuery] = useWidgetState('query', '');
  const [by, setBy] = useWidgetState<GroupBy>('groupBy', 'finder');
  const [view, setView] = useWidgetState<SpoilerView>('view', 'compact');
  const [open, setOpen] = useWidgetState<Record<string, readonly string[]>>('open', NO_OPEN);
  const setExpanded = useCallback((keys: readonly string[]) => setOpen((now) => ({ ...now, [tab]: keys })), [setOpen, tab]);
  return { tab, setTab, clauses, setClauses, query, setQuery, by, setBy, view, setView, expanded: open[tab] ?? NONE, setExpanded };
};

export { useSpoilerState };
