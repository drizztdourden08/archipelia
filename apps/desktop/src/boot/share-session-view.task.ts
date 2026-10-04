/* @layer renderer-app @kind logic */
import { defineBootTask, shareWithWidgets } from '@drizztdourden08/brock-react';
import { SESSION_VIEW_SLICE } from '../stores/session-view-store.constants';
import { useSessionViewStore } from '../stores/useSessionViewStore';

export default defineBootTask({
  label: 'Sharing the session with widget windows',
  after: ['settings'],
  run: ({ report }) => {
    shareWithWidgets(useSessionViewStore, { kind: SESSION_VIEW_SLICE, pick: ({ session, lines, loaded, failed }) => ({ session, lines, loaded, failed }) });
    report(1);
  },
});
