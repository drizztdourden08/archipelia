/* @layer core @kind logic */
import { newToken } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { Lobby } from '@archipelia/model';

const syncJoinToken = (lobby: Lobby): Lobby => {
  if (lobby.options.listed !== true) {
    delete lobby.joinToken;
    return lobby;
  }
  lobby.joinToken ??= newToken();
  return lobby;
};

export { syncJoinToken };
