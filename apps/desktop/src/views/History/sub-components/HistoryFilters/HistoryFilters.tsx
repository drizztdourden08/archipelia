/* @layer renderer-app @kind component */
import { Select, Stack } from '@drizztdourden08/tessera/primitives';
import type { RangeFilter, StatusFilter } from '../../../../stores/history-filter-store.type';
import { RANGE_OPTIONS, STATUS_OPTIONS } from '../../History.constants';
import type { HistoryFiltersProps } from './HistoryFilters.type';

const HistoryFilters = ({ filter, sessions }: HistoryFiltersProps) => (
  <Stack gap="xs">
    <Select value={filter.sessionKey} options={sessions} onChange={filter.setSessionKey} searchable aria-label="Filter by session" />
    <Select value={filter.status} options={STATUS_OPTIONS} onChange={(value) => filter.setStatus(value as StatusFilter)} aria-label="Filter by status" />
    <Select value={filter.range} options={RANGE_OPTIONS} onChange={(value) => filter.setRange(value as RangeFilter)} aria-label="Filter by date" />
  </Stack>
);

export { HistoryFilters };
