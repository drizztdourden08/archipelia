/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { RunStats } from './run-stats.type';

const runStatsOf = (runs: readonly Session[]): Record<string, RunStats> => {
  const stats: Record<string, RunStats> = {};
  for (const run of runs) {
    const id = run.source?.sessionId;
    if (!id) continue;
    const before = stats[id];
    stats[id] = { count: (before?.count ?? 0) + 1, last: Math.max(before?.last ?? 0, run.createdAt) };
  }
  return stats;
};

export { runStatsOf };
