/* @layer electron-main @kind logic */
import { createSocketTransport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { ServerTarget } from '../../../src/lobbies/lobbies.type';
import type { AdminLink } from '../lobbies.type';
import { encodeMaskedFrame } from './encode-masked-frame';
import { openSocket } from './open-socket';
import { NORMAL_CLOSE, OPCODE } from './remote.constants';
import { upgradeSocket } from './upgrade-socket';

const connectAdminLink = async (target: ServerTarget, pin?: string): Promise<AdminLink> => {
  const socket = await openSocket(target, pin);
  await upgradeSocket(socket, target);
  const transport = createSocketTransport(socket);
  return {
    send: (text) => {
      if (!socket.destroyed) socket.write(encodeMaskedFrame(OPCODE.text, Buffer.from(text, 'utf8')));
    },
    close: () => {
      if (socket.destroyed) return;
      const code = Buffer.alloc(2);
      code.writeUInt16BE(NORMAL_CLOSE, 0);
      socket.write(encodeMaskedFrame(OPCODE.close, code));
      socket.end();
    },
    listen: transport.listen,
  };
};

export { connectAdminLink };
