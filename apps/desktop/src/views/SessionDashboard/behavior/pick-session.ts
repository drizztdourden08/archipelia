/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const newestFirst = (runs: readonly Session[]) => [...runs].sort((a, b) => b.createdAt - a.createdAt);

const pickSession = (runs: readonly Session[], sessionId: string): Session | null => {
  if (sessionId) return runs.find((run) => run.id === sessionId) ?? null;
  return newestFirst(runs).find((run) => run.status === 'hosting') ?? null;
};

export { pickSession };
