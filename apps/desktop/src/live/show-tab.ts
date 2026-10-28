/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { useLiveStore } from '../stores/useLiveStore';

const showTab = (tabId: string): void => {
  useLiveStore.getState().activate(tabId);
  nav.close();
};

export { showTab };
