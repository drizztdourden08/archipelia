/* @layer renderer-app @kind config */
import type { LiveRoomPhase } from '@archipelia/sessions/live-room';

const PHASE_TEXT: Partial<Record<LiveRoomPhase, string>> = {
  idle: 'Live data shows while the room is hosting.',
  closed: 'The room closed the connection.',
};

const CONNECTING_TEXT = 'Connecting to the room';

export { CONNECTING_TEXT, PHASE_TEXT };
