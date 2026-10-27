/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { NO_FILTER } from './history-filter-store.constants';
import type { HistoryFilterState } from './history-filter-store.type';

const useHistoryFilterStore = createSessionStore<HistoryFilterState>((set) => ({
  ...NO_FILTER,
  setSessionKey: (sessionKey) => set({ sessionKey }),
  setStatus: (status) => set({ status }),
  setRange: (range) => set({ range }),
  showSession: (sessionKey) => set({ ...NO_FILTER, sessionKey }),
}));

export { useHistoryFilterStore };
