/* @layer electron-main @kind logic */
import { LOBBY_PATH } from '@drizztdourden08/archipelia-lobby-protocol';
import { createSocketTransport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { ServerTarget } from '../../../src/lobbies/lobbies.type';
import { openSocket } from '../remote/open-socket';
import { upgradeSocket } from '../remote/upgrade-socket';

const openLobbyTransport = async (target: ServerTarget) => {
  const socket = await openSocket(target);
  await upgradeSocket(socket, target, LOBBY_PATH);
  return createSocketTransport(socket, { client: true });
};

export { openLobbyTransport };
