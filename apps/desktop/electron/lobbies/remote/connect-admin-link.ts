/* @layer electron-main @kind logic */
import { createSocketTransport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { ServerTarget } from '../../../src/lobbies/lobbies.type';
import type { AdminLink } from '../lobbies.type';
import { openSocket } from './open-socket';
import { upgradeSocket } from './upgrade-socket';

const connectAdminLink = async (target: ServerTarget, pin?: string): Promise<AdminLink> => {
  const socket = await openSocket(target, pin);
  await upgradeSocket(socket, target);
  const transport = createSocketTransport(socket, { client: true });
  return { send: transport.send, close: () => transport.close(), listen: transport.listen };
};

export { connectAdminLink };
