/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { LiveRoomTarget } from './live-room.type';
import { roomUrls } from './room-urls';

const watchSlotName = (session: Session) =>
  [...session.snapshot.players].sort((a, b) => a.slot - b.slot)[0]?.name ?? null;

const watchTarget = (session: Session): LiveRoomTarget | null => {
  const slotName = watchSlotName(session);
  if (session.status !== 'hosting' || !session.endpoint || !slotName) return null;
  return { sessionId: session.id, urls: roomUrls(session.endpoint, session.snapshot.host), slotName };
};

export { watchTarget };
