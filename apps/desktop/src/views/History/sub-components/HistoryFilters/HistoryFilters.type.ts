/* @layer renderer-app @kind types */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { HistoryFilterState } from '../../../../stores/history-filter-store.type';

type HistoryFiltersProps = {
  filter: HistoryFilterState;
  sessions: readonly SelectOption[];
};

export type { HistoryFiltersProps };
