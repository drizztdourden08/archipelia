/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { runOfLobby } from '../runs/run-of-lobby';
import type { LiveTab } from './live.type';

const runOfTab = (runs: readonly Session[], tab: Pick<LiveTab, 'lobbyId' | 'runId'>): Session | undefined =>
  runOfLobby(runs, tab.lobbyId) ?? runs.find((run) => run.id === tab.runId);

export { runOfTab };
