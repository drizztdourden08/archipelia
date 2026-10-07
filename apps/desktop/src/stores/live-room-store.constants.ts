/* @layer renderer-app @kind config */
import type { LiveRoomData, LiveRoomRetry } from './live-room-store.type';

const TRACKER_TAGS = ['Tracker', 'NoText'];

const NO_RETRY: LiveRoomRetry = { retryAt: null, attempt: 0, attempts: 0, retrying: false };

const IDLE: LiveRoomData = {
  sessionId: null, phase: 'idle', error: null, players: [], statuses: {}, hints: [], watched: null, passwordRequired: false, ...NO_RETRY,
};

const LIVE_FAILED = 'Could not connect to the room.';

const LIVE_LOST = 'The room stopped answering.';

const WRONG_PASSWORD = 'Wrong password';

export { IDLE, LIVE_FAILED, LIVE_LOST, NO_RETRY, TRACKER_TAGS, WRONG_PASSWORD };
