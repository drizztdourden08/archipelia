/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const newestRuns = (runs: readonly Session[], count: number) => [...runs].sort((a, b) => b.createdAt - a.createdAt).slice(0, count);

export { newestRuns };
