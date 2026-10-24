/* @layer core @kind logic */
import type { Failure, Hello } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { usedSlots } from '../state/used-slots';
import { LOBBY_CLOSED, LOBBY_FULL, LOBBY_LOCKED } from './join.constants';

const checkAccess = (lobby: Lobby, hello: Hello): Failure | null => {
  if (lobby.phase === 'closed') return LOBBY_CLOSED;
  if (hello.resume) return null;
  if (lobby.phase !== 'open') return LOBBY_LOCKED;
  if (usedSlots(lobby) + hello.slots.length > lobby.options.maxSlots) return LOBBY_FULL;
  return null;
};

export { checkAccess };
