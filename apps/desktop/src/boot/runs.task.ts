/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { useRunsStore } from '../state/useRunsStore';

export default defineBootTask({
  label: 'Loading sessions',
  after: ['settings'],
  run: async ({ report }) => {
    await useRunsStore.getState().load();
    report(1);
  },
});
