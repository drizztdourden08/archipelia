/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { useRunsStore } from '../stores/useRunsStore';

export default defineBootTask({
  label: 'Loading runs',
  after: ['settings'],
  run: async ({ report }) => {
    await useRunsStore.getState().load();
    report(1);
  },
});
