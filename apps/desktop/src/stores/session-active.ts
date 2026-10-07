/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const sessionActive = (focusedId: string, runs: readonly Pick<Session, 'id' | 'status'>[]): boolean =>
  runs.some((run) => run.id === focusedId || run.status === 'hosting');

export { sessionActive };
