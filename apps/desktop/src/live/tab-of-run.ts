/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { LiveTab } from './live.type';

const tabOfRun = (tabs: readonly LiveTab[], run: Pick<Session, 'id' | 'lobbyId'>): LiveTab | undefined =>
  tabs.find((tab) => tab.runId === run.id || (run.lobbyId !== undefined && tab.lobbyId === run.lobbyId));

export { tabOfRun };
