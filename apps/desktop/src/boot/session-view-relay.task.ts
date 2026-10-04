/* @layer renderer-app @kind logic */
import { defineBootTask, hostApi, useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { IpcApi } from '@drizztdourden08/brock-core';
import { SESSION_VIEW_RELAY_MS, SESSION_VIEW_SLICE } from '../stores/session-view-store.constants';
import { useSessionViewStore } from '../stores/useSessionViewStore';

const relaySessionView = (api: IpcApi): void => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const send = (): void => {
    timer = null;
    const { session, lines, loaded } = useSessionViewStore.getState();
    api.publishWidgetSlice({ kind: SESSION_VIEW_SLICE, data: { session, lines, loaded } });
  };
  const later = (): void => {
    if (timer === null && useWidgetLayoutStore.getState().layout.popped.length > 0) timer = setTimeout(send, SESSION_VIEW_RELAY_MS);
  };
  useSessionViewStore.subscribe(later);
  api.onWidgetSnapshotRequest(send);
};

export default defineBootTask({
  label: 'Sharing the session with widget windows',
  after: ['settings'],
  run: ({ report }) => {
    const api = hostApi();
    if (api) relaySessionView(api);
    report(1);
  },
});
