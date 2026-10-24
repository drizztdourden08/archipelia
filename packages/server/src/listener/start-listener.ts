/* @layer core @kind logic */
import type { AddressInfo, Socket } from 'node:net';
import { createServer } from 'node:net';
import { Duplex } from 'node:stream';
import { createSecureContext, TLSSocket } from 'node:tls';
import type { SecureContext } from 'node:tls';
import { createRateLimiter } from '../lobby/link/create-rate-limiter';
import type { RateLimiter } from '../lobby/link/link.type';
import { SERVER_NAME } from '../lobby/lobby.constants';
import { acceptSocket } from './accept-socket';
import { SWEEP_INTERVAL_MS, TLS_HANDSHAKE } from './listener.constants';
import type { AdminDeps, ListenerOptions, RunningListener } from './listener.type';

const route = (socket: Socket, deps: { admin: AdminDeps; limiter: RateLimiter }, secure: SecureContext | undefined) => {
  socket.once('data', (first: Buffer) => {
    socket.pause();
    socket.unshift(first);
    const address = socket.remoteAddress ?? '';
    if (first[0] !== TLS_HANDSHAKE) {
      void acceptSocket(socket, { address, secure: false }, deps).catch(() => socket.destroy());
      socket.resume();
      return;
    }
    if (!secure) return socket.destroy();
    const wrapped = new TLSSocket(Duplex.from({ readable: socket, writable: socket }), { isServer: true, secureContext: secure });
    void acceptSocket(wrapped, { address, secure: true }, deps).catch(() => socket.destroy());
    socket.resume();
    return undefined;
  });
  socket.on('error', () => socket.destroy());
};

const startListener = (options: ListenerOptions): Promise<RunningListener> =>
  new Promise((resolve, reject) => {
    let bound = options.port;
    const admin: AdminDeps = { ...options.admin, service: options.service, info: () => ({ name: SERVER_NAME, version: options.serverVersion, port: bound, sandbox: 'none' }) };
    const deps = { admin, limiter: createRateLimiter() };
    const secure = options.tls ? createSecureContext(options.tls) : undefined;
    const sockets = new Set<Socket>();
    const server = createServer((socket) => {
      sockets.add(socket);
      socket.once('close', () => sockets.delete(socket));
      route(socket, deps, secure);
    });
    const sweep = setInterval(() => void options.service.sweep().catch(() => undefined), SWEEP_INTERVAL_MS).unref();
    server.once('error', reject);
    server.listen(options.port, options.host, () => {
      const { port } = server.address() as AddressInfo;
      bound = port;
      const stop = () => new Promise<void>((done) => {
        clearInterval(sweep);
        for (const socket of sockets) socket.destroy();
        server.close(() => done());
      });
      resolve({ host: options.host, port, stop });
    });
  });

export { startListener };
