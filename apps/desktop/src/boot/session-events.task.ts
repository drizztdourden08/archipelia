/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { useRunsStore } from '../stores/useRunsStore';

export default defineBootTask({
  label: 'Listening to sessions',
  after: ['settings'],
  run: ({ report }) => {
    appApi().onSessionEvent((event) => useRunsStore.getState().apply(event));
    report(1);
  },
});
