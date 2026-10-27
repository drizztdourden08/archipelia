/* @layer renderer-app @kind config */
import type { HistoryFilter } from './history-filter-store.type';

const ALL = 'all';

const NO_FILTER: HistoryFilter = { sessionKey: ALL, status: ALL, range: ALL };

export { ALL, NO_FILTER };
