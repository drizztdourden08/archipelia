/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { useLiveStore } from '../../../stores/useLiveStore';
import { TAB_MENU } from '../SessionTabs.constants';
import { tabIdOf } from './tab-id-of';
import { tabMenuEntries } from './tab-menu-entries';

const activateClicked = (context: ContextMenuContext): void => {
  const tabId = tabIdOf(context);
  if (tabId !== undefined) useLiveStore.getState().activate(tabId);
};

const useTabsMenu = (): void => {
  useContextMenu(TAB_MENU.zone, { label: TAB_MENU.label, beforeOpen: activateClicked, entries: tabMenuEntries });
};

export { useTabsMenu };
