/* @layer core @kind logic */
import type { ServerMessage } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import type { LobbyHub } from '../hub/lobby-hub.type';

const sendApproved = (hub: LobbyHub, lobby: Lobby, message: ServerMessage) => {
  for (const memberId of hub.connected(lobby.id)) {
    if (lobby.members.find((member) => member.id === memberId)?.admission === 'approved') hub.send({ lobbyId: lobby.id, memberId }, message);
  }
};

export { sendApproved };
