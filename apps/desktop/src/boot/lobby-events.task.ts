/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { useLobbyStore } from '../stores/useLobbyStore';

export default defineBootTask({
  label: 'Listening to lobbies',
  after: ['settings'],
  run: ({ report }) => {
    appApi().onLobbyEvent((event) => useLobbyStore.getState().apply(event));
    report(1);
  },
});
