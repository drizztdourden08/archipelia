/* @layer renderer-app @kind config */
import type { LiveRoomPhase } from '../../../../live-room/live-room.type';

const PHASE_TEXT: Partial<Record<LiveRoomPhase, string>> = {
  idle: 'Live data shows while the room is hosting.',
  connecting: 'Connecting to the room',
  closed: 'The room closed the connection.',
};

export { PHASE_TEXT };
