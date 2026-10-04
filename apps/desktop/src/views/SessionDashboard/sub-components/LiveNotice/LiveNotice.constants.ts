/* @layer renderer-app @kind config */
import type { LiveRoomPhase } from '@archipelia/sessions/live-room';

const PHASE_TEXT: Partial<Record<LiveRoomPhase, string>> = {
  idle: 'Live data shows while the room is hosting.',
  connecting: 'Connecting to the room',
  closed: 'The room closed the connection.',
};

export { PHASE_TEXT };
