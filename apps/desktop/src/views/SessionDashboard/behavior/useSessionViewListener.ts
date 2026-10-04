/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { hostApi } from '@drizztdourden08/brock-react';
import { inWidgetWindow } from '../../../session-widgets/in-widget-window';
import { SESSION_VIEW_SLICE } from '../../../stores/session-view-store.constants';
import type { SessionView } from '../../../stores/session-view-store.type';
import { useSessionViewStore } from '../../../stores/useSessionViewStore';

const listen = () => hostApi()?.onWidgetRelay(({ kind, data }) => {
  if (kind === SESSION_VIEW_SLICE) useSessionViewStore.getState().show(data as SessionView);
});

const useSessionViewListener = (): void => {
  useEffect(() => (inWidgetWindow() ? listen() : undefined), []);
};

export { useSessionViewListener };
