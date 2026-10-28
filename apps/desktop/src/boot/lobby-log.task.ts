/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { useLobbyLogStore } from '../stores/useLobbyLogStore';
import { useLobbyStore } from '../stores/useLobbyStore';

const record = () => {
  const { record: add } = useLobbyLogStore.getState();
  const at = Date.now();
  Object.values(useLobbyStore.getState().lobbies).flat().forEach((lobby) => add(lobby, at));
};

export default defineBootTask({
  label: 'Writing the lobby log',
  after: ['settings'],
  run: ({ report }) => {
    useLobbyStore.subscribe(record);
    record();
    report(1);
  },
});
