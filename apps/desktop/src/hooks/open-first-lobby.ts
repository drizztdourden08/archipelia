/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { ROUTE } from './app-navigation.constants';
import { openSessionLobby } from './open-session-lobby';

const openFirstLobby = async (): Promise<void> => {
  await useLibraryStore.getState().loadTemplates();
  const [first] = useLibraryStore.getState().templates;
  if (first) openSessionLobby(first.id);
  else nav.open(ROUTE.sessions);
};

export { openFirstLobby };
