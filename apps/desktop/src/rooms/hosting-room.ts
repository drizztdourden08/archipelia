/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const hostingRoom = (runs: readonly Session[]): Session | undefined =>
  runs.filter((run) => run.status === 'hosting').sort((a, b) => b.createdAt - a.createdAt)[0];

export { hostingRoom };
