/* @layer renderer-app @kind logic */
import type { LobbyStageCode } from '@archipelia/design';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { addressText } from '../../../lobbies/address-text';
import type { ServerPlace } from '../../../lobbies/lobbies.type';
import { splitAddress } from '../../../lobbies/split-address';
import { networkCodes } from '../../../stage';
import { LOBBY_SCREEN } from '../SessionLobby.constants';

const lobbyCodes = (lobby: AdminLobby | undefined, place: ServerPlace): LobbyStageCode[] => {
  if (!lobby) return [];
  const { room } = lobby;
  const where = splitAddress(place.address);
  return [
    { label: LOBBY_SCREEN.code, value: formatLobbyCode(lobby.code) ?? lobby.code, copyLabel: LOBBY_SCREEN.codeCopy },
    ...networkCodes({ host: place.label, ip: where?.ip, port: where?.port }, room?.state === 'hosting' ? addressText(room.host, room.port) : null),
  ];
};

export { lobbyCodes };
