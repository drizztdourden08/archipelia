/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { useHistoryFilterStore } from '../stores/useHistoryFilterStore';
import { ROUTE } from './app-navigation.constants';

const openHistory = (sessionKey?: string): void => {
  if (sessionKey) useHistoryFilterStore.getState().showSession(sessionKey);
  nav.open(ROUTE.history);
};

export { openHistory };
