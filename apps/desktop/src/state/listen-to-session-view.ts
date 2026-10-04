/* @layer renderer-app @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import { SESSION_VIEW_SLICE } from './session-view-store.constants';
import type { SessionView } from './session-view-store.type';
import { useSessionViewStore } from './useSessionViewStore';

const listenToSessionView = () => hostApi()?.onWidgetRelay(({ kind, data }) => {
  if (kind === SESSION_VIEW_SLICE) useSessionViewStore.getState().show(data as SessionView);
});

export { listenToSessionView };
