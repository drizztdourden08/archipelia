/* @layer core @kind logic */
import type { AddressInfo } from 'node:net';
import { createServer } from 'node:net';
import { createSecureContext } from 'node:tls';
import { createRateLimiter } from '../lobby/link/create-rate-limiter';
import { SERVER_NAME } from '../lobby/lobby.constants';
import { countConnections } from './count-connections';
import { PRUNE_INTERVAL_MS, SWEEP_INTERVAL_MS } from './listener.constants';
import type { AdminDeps, ListenerOptions, RunningListener } from './listener.type';
import { routeSocket } from './route-socket';

const startListener = (options: ListenerOptions): Promise<RunningListener> =>
  new Promise((resolve, reject) => {
    let bound = options.port;
    const sandbox = options.sandbox ?? 'none';
    const info = () => ({ name: SERVER_NAME, version: options.serverVersion, port: bound, sandbox, tls: options.tls !== undefined });
    const admin: AdminDeps = { ...options.admin, service: options.service, info, sandbox };
    const limiter = createRateLimiter();
    const deps = { admin, limiter, log: options.log ?? (() => undefined), ...(options.upgradeTimeoutMs ? { upgradeTimeoutMs: options.upgradeTimeoutMs } : {}) };
    const secure = options.tls ? createSecureContext(options.tls) : undefined;
    const connections = countConnections();
    const server = createServer((socket) => {
      if (connections.admit(socket)) routeSocket(socket, deps, secure);
      else socket.destroy();
    });
    const sweep = setInterval(() => void options.service.sweep().catch(() => undefined), SWEEP_INTERVAL_MS).unref();
    const prune = setInterval(limiter.prune, PRUNE_INTERVAL_MS).unref();
    server.once('error', reject);
    server.listen(options.port, options.host, () => {
      const { port } = server.address() as AddressInfo;
      bound = port;
      const stop = () => new Promise<void>((done) => {
        clearInterval(sweep);
        clearInterval(prune);
        connections.destroyAll();
        server.close(() => done());
      });
      resolve({ host: options.host, port, secure: options.tls !== undefined, stop });
    });
  });

export { startListener };
