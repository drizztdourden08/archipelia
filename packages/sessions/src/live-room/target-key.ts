/* @layer core @kind logic */
import type { LiveRoomTarget } from './live-room.type';

const targetKey = (target: LiveRoomTarget | null) => (target ? `${target.sessionId}|${target.urls.join(',')}|${target.slotName}` : '');

export { targetKey };
