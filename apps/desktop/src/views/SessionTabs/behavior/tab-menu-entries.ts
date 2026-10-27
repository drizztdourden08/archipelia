/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { closeOtherTabs } from '../../../live/close-other-tabs';
import { closeTab } from '../../../live/close-tab';
import { useLiveStore } from '../../../stores/useLiveStore';
import { TAB_MENU } from '../SessionTabs.constants';
import { tabIdOf } from './tab-id-of';

const tabMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const tabId = tabIdOf(context);
  if (tabId === undefined) return [];
  const alone = useLiveStore.getState().tabs.length < 2;
  return [
    { label: TAB_MENU.close, run: () => void closeTab(tabId) },
    { label: TAB_MENU.closeOthers, run: () => void closeOtherTabs(tabId), disabled: alone, reason: alone ? TAB_MENU.onlyTab : undefined },
  ];
};

export { tabMenuEntries };
