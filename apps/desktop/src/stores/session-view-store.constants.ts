/* @layer renderer-app @kind config */
import type { NetworkView, SessionView } from './session-view-store.type';

const EMPTY_NETWORK: NetworkView = { status: null, names: {}, facts: [] };

const EMPTY_SESSION_VIEW: SessionView = { session: null, lines: [], loaded: false, failed: false, phase: null, lobby: null, network: EMPTY_NETWORK };

const SESSION_VIEW_SLICE = 'archipelia:session-view';

export { EMPTY_SESSION_VIEW, SESSION_VIEW_SLICE };
