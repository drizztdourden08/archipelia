/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { keepRunsLoaded } from '../runs/keep-runs-loaded';
import { useRunsStore } from '../stores/useRunsStore';

export default defineBootTask({
  label: 'Loading runs',
  after: ['settings'],
  run: async ({ report }) => {
    keepRunsLoaded();
    await useRunsStore.getState().load();
    report(1);
  },
});
