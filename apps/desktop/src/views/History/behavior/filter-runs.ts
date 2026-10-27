/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { ALL } from '../../../stores/history-filter-store.constants';
import type { HistoryFilter } from '../../../stores/history-filter-store.type';
import { DAY_MS, STATUS_GROUP } from '../History.constants';
import { sourceKeyOf } from './source-key';
import { sourceNameOf } from './source-name';

const inSession = (run: Session, { sessionKey }: HistoryFilter): boolean => sessionKey === ALL || sourceKeyOf(run) === sessionKey;

const inStatus = (run: Session, { status }: HistoryFilter): boolean => status === ALL || STATUS_GROUP[status].includes(run.status);

const inRange = (run: Session, { range }: HistoryFilter, now: number): boolean => range === ALL || now - run.createdAt <= Number(range) * DAY_MS;

const matchesQuery = (run: Session, query: string): boolean => {
  const needle = query.trim().toLowerCase();
  return !needle || `${run.snapshot.name} ${run.status} ${run.seed ?? ''} ${sourceNameOf(run)}`.toLowerCase().includes(needle);
};

const filterRuns = (runs: readonly Session[], filter: HistoryFilter, query: string, now: number): Session[] =>
  runs.filter((run) => inSession(run, filter) && inStatus(run, filter) && inRange(run, filter, now) && matchesQuery(run, query));

export { filterRuns };
