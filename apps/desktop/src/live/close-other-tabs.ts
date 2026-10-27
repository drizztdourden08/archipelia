/* @layer renderer-app @kind logic */
import { useLiveStore } from '../stores/useLiveStore';
import { closeTab } from './close-tab';

const closeOtherTabs = async (keepId: string): Promise<void> => {
  for (const tab of useLiveStore.getState().tabs) if (tab.tabId !== keepId && !(await closeTab(tab.tabId))) return;
};

export { closeOtherTabs };
