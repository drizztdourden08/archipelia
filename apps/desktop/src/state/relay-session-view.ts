/* @layer renderer-app @kind logic */
import { hostApi, useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import { SESSION_VIEW_RELAY_MS, SESSION_VIEW_SLICE } from './session-view-store.constants';
import { useSessionViewStore } from './useSessionViewStore';

const relaySessionView = (): (() => void) => {
  const api = hostApi();
  if (!api) return () => undefined;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const send = (): void => {
    timer = null;
    const { session, lines, loaded } = useSessionViewStore.getState();
    api.publishWidgetSlice({ kind: SESSION_VIEW_SLICE, data: { session, lines, loaded } });
  };
  const later = (): void => {
    if (timer === null && useWidgetLayoutStore.getState().layout.popped.length > 0) timer = setTimeout(send, SESSION_VIEW_RELAY_MS);
  };
  const offs = [useSessionViewStore.subscribe(later), api.onWidgetSnapshotRequest(send)];
  return () => {
    if (timer !== null) clearTimeout(timer);
    for (const off of offs) off();
  };
};

export { relaySessionView };
