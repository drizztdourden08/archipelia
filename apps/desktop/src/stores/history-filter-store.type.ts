/* @layer renderer-app @kind types */
type StatusFilter = 'all' | 'hosting' | 'stopped' | 'failed';

type RangeFilter = 'all' | '7' | '30' | '90';

type HistoryFilter = { sessionKey: string; status: StatusFilter; range: RangeFilter };

type HistoryFilterState = HistoryFilter & {
  setSessionKey: (sessionKey: string) => void;
  setStatus: (status: StatusFilter) => void;
  setRange: (range: RangeFilter) => void;
  showSession: (sessionKey: string) => void;
};

export type { HistoryFilter, HistoryFilterState, RangeFilter, StatusFilter };
