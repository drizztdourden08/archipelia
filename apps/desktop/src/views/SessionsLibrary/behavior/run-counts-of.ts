/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const runCountsOf = (runs: readonly Session[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const run of runs) {
    const id = run.source?.sessionId;
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
};

export { runCountsOf };
