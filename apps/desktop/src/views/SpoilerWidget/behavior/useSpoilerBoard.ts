/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { SpoilerItemTypes, SpoilerLog } from '@archipelia/sessions/spoiler';
import { entriesOf } from './entries-of';
import { fieldsOf } from './fields-of';
import { filterEntries } from './filter-entries';
import { rootOf } from './root-of';
import { statsOf } from './stats-of';
import { tabsOf } from './tabs-of';
import { useSpoilerState } from './useSpoilerState';

const useSpoilerBoard = (log: SpoilerLog, types: SpoilerItemTypes | null) => {
  const state = useSpoilerState();
  const { tab, query, clauses, by } = state;
  const entries = useMemo(() => entriesOf(log, types), [log, types]);
  const fields = useMemo(() => fieldsOf(entries), [entries]);
  const shown = useMemo(() => filterEntries(entries, query, clauses, fields), [entries, query, clauses, fields]);
  const root = useMemo(() => rootOf(tab, { log, entries, shown, by }), [tab, log, entries, shown, by]);
  const stats = useMemo(() => statsOf(log), [log]);
  const tabs = useMemo(() => tabsOf(log, shown.length), [log, shown.length]);
  return { state, fields, root, stats, tabs, total: entries.length, shown: shown.length };
};

export { useSpoilerBoard };
