/* @layer core @kind logic */
import type { Socket } from 'node:net';
import { Duplex } from 'node:stream';
import { TLSSocket } from 'node:tls';
import type { SecureContext } from 'node:tls';
import { acceptSocket } from './accept-socket';
import { TLS_HANDSHAKE, UPGRADE_TIMEOUT_MS } from './listener.constants';
import type { AcceptDeps } from './listener.type';

const routeSocket = (socket: Socket, deps: Omit<AcceptDeps, 'upgraded'> & { upgradeTimeoutMs?: number }, secure: SecureContext | undefined) => {
  const deadline = setTimeout(() => socket.destroy(), deps.upgradeTimeoutMs ?? UPGRADE_TIMEOUT_MS).unref();
  socket.once('close', () => clearTimeout(deadline));
  const accept = { ...deps, upgraded: () => clearTimeout(deadline) };
  socket.once('data', (first: Buffer) => {
    socket.pause();
    socket.unshift(first);
    const address = socket.remoteAddress ?? '';
    if (first[0] !== TLS_HANDSHAKE) {
      void acceptSocket(socket, { address, secure: false }, accept).catch(() => socket.destroy());
      socket.resume();
      return;
    }
    if (!secure) {
      socket.destroy();
      return;
    }
    const wrapped = new TLSSocket(Duplex.from({ readable: socket, writable: socket }), { isServer: true, secureContext: secure });
    wrapped.on('error', () => socket.destroy());
    void acceptSocket(wrapped, { address, secure: true }, accept).catch(() => socket.destroy());
    socket.resume();
  });
  socket.on('error', () => socket.destroy());
};

export { routeSocket };
