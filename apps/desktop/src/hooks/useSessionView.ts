/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { hostApi, useWindowKind } from '@drizztdourden08/brock-react';
import { SESSION_VIEW_SLICE } from '../stores/session-view-store.constants';
import type { SessionView } from '../stores/session-view-store.type';
import { useSessionViewStore } from '../stores/useSessionViewStore';

const listen = () => hostApi()?.onWidgetRelay(({ kind, data }) => {
  if (kind === SESSION_VIEW_SLICE) useSessionViewStore.getState().show(data as SessionView);
});

const useSessionView = (): SessionView => {
  const { kind } = useWindowKind();
  useEffect(() => (kind === 'widget' ? listen() : undefined), [kind]);
  const session = useSessionViewStore((state) => state.session);
  const lines = useSessionViewStore((state) => state.lines);
  const loaded = useSessionViewStore((state) => state.loaded);
  return { session, lines, loaded };
};

export { useSessionView };
