/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { useLiveStore } from '../stores/useLiveStore';
import { showTab } from './show-tab';
import { tabOfRun } from './tab-of-run';

const showRun = (run: Pick<Session, 'id' | 'lobbyId'>): boolean => {
  const tab = tabOfRun(useLiveStore.getState().tabs, run);
  if (tab) showTab(tab.tabId);
  return tab !== undefined;
};

export { showRun };
