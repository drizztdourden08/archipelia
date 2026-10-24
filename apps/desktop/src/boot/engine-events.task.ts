/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { useEngineStore } from '../stores/useEngineStore';
import { useLibraryStore } from '../stores/useLibraryStore';

export default defineBootTask({
  label: 'Listening to the engine',
  after: ['settings'],
  run: ({ report }) => {
    appApi().onEngineEvent((event) => {
      useEngineStore.getState().apply(event);
      if (event.kind === 'switched') void useLibraryStore.getState().loadGames().catch(() => undefined);
    });
    report(1);
  },
});
