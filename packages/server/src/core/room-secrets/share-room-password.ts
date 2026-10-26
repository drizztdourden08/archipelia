/* @layer core @kind logic */
import type { SecretStore } from '@archipelia/hosts';
import { ROOM_SECRET_PREFIX } from '../../lobby/lobby.constants';

const shareRoomPassword = (secrets: SecretStore) => async (lobbyId: string, passwordRef: string): Promise<void> => {
  const password = await secrets.get(passwordRef);
  if (password) await secrets.set(`${ROOM_SECRET_PREFIX}${lobbyId}`, password, 'Room password of a session');
};

export { shareRoomPassword };
