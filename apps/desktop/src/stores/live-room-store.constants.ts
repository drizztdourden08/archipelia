/* @layer renderer-app @kind config */
import type { LiveRoomData } from './live-room-store.type';

const TRACKER_TAGS = ['Tracker', 'NoText'];

const IDLE: LiveRoomData = {
  sessionId: null, phase: 'idle', error: null, players: [], statuses: {}, hints: [], watched: null, passwordRequired: false,
};

export { IDLE, TRACKER_TAGS };
