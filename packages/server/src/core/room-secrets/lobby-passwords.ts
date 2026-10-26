/* @layer core @kind logic */
import { ROOM_SECRET_PREFIX } from '../../lobby/lobby.constants';
import type { ForgettingStore } from './room-secrets.type';

const lobbyPasswords = (secrets: ForgettingStore) => ({
  share: async (lobbyId: string, passwordRef: string): Promise<void> => {
    const password = await secrets.get(passwordRef);
    if (password) await secrets.set(`${ROOM_SECRET_PREFIX}${lobbyId}`, password, 'Room password of a session');
  },
  forget: (lobbyId: string): Promise<void> => secrets.forget(`${ROOM_SECRET_PREFIX}${lobbyId}`),
});

export { lobbyPasswords };
