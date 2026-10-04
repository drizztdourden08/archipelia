/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { DAY_MS, LIVE } from '../OldRuns.constants';

const olderThan = (runs: Session[], days: number, now: number) =>
  runs.filter((run) => !LIVE.has(run.status) && now - run.createdAt > days * DAY_MS);

export { olderThan };
