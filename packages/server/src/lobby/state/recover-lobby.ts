/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { ROOM_TTL_MS } from '../lobby.constants';
import { INTERRUPTED_GENERATION } from './state.constants';

const recoverLobby = (lobby: Lobby, now: number): Lobby | null => {
  if (lobby.phase === 'generating') return { ...lobby, phase: 'failed', failure: { stage: 'generate', message: INTERRUPTED_GENERATION }, rev: lobby.rev + 1 };
  if (lobby.room?.state !== 'hosting') return null;
  return { ...lobby, room: { ...lobby.room, state: 'stopped' }, closesAt: now + ROOM_TTL_MS, rev: lobby.rev + 1 };
};

export { recoverLobby };
