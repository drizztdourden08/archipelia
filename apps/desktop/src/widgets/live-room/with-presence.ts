/* @layer renderer-app @kind logic */
import type { PlayerStatus } from './live-room.type';

const withPresence = (stored: PlayerStatus, online: boolean | undefined): PlayerStatus => {
  if (stored === 'goal') return stored;
  if (online === undefined) return stored === 'connected' ? 'unknown' : stored;
  if (!online) return 'offline';
  return stored === 'unknown' || stored === 'offline' ? 'connected' : stored;
};

export { withPresence };
