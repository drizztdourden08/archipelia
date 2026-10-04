/* @layer renderer-app @kind config */
import type { SessionView } from './session-view-store.type';

const EMPTY_SESSION_VIEW: SessionView = { session: null, lines: [], loaded: false };

const SESSION_VIEW_SLICE = 'archipelia:session-view';

const SESSION_VIEW_RELAY_MS = 250;

export { EMPTY_SESSION_VIEW, SESSION_VIEW_RELAY_MS, SESSION_VIEW_SLICE };
