/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { useLiveStore } from '../stores/useLiveStore';

export default defineBootTask({
  label: 'Listening to open sessions',
  after: ['settings'],
  run: async ({ report }) => {
    appApi().onLiveEvent((tabs) => {
      useLiveStore.getState().apply(tabs);
      void useLibraryStore.getState().loadTemplates().catch(() => undefined);
    });
    await useLiveStore.getState().load();
    report(1);
  },
});
