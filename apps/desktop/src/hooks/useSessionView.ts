/* @layer renderer-app @kind hook */
import { useWidgetSlice } from '@drizztdourden08/brock-react';
import { EMPTY_SESSION_VIEW, SESSION_VIEW_SLICE } from '../stores/session-view-store.constants';
import type { SessionView } from '../stores/session-view-store.type';

const useSessionView = (): SessionView => useWidgetSlice<SessionView>(SESSION_VIEW_SLICE, EMPTY_SESSION_VIEW);

export { useSessionView };
