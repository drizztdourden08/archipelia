/* @layer core @kind logic */
import type { Socket } from 'node:net';
import { MAX_CONNECTIONS, MAX_CONNECTIONS_PER_ADDRESS } from './listener.constants';

const countConnections = () => {
  const sockets = new Set<Socket>();
  const perAddress = new Map<string, number>();
  const admit = (socket: Socket): boolean => {
    const address = socket.remoteAddress ?? '';
    const used = perAddress.get(address) ?? 0;
    if (sockets.size >= MAX_CONNECTIONS || used >= MAX_CONNECTIONS_PER_ADDRESS) return false;
    sockets.add(socket);
    perAddress.set(address, used + 1);
    socket.once('close', () => {
      sockets.delete(socket);
      const left = (perAddress.get(address) ?? 1) - 1;
      if (left > 0) perAddress.set(address, left);
      else perAddress.delete(address);
    });
    return true;
  };
  const destroyAll = () => {
    for (const socket of sockets) socket.destroy();
  };
  return { admit, destroyAll };
};

export { countConnections };
