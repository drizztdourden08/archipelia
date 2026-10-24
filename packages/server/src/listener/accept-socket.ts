/* @layer core @kind logic */
import type { Duplex } from 'node:stream';
import { LOBBY_PATH } from '@archipelia/lobby-protocol';
import { createSocketTransport, upgradeResponse } from '@archipelia/lobby-protocol/node';
import { createLobbyConnection } from '../lobby/link/create-lobby-connection';
import type { RateLimiter } from '../lobby/link/link.type';
import { createAdminConnection } from './admin/create-admin-connection';
import { ADMIN_PATH, NOT_FOUND, UPGRADE_REQUIRED } from './listener.constants';
import type { AdminDeps, Peer } from './listener.type';
import { readHead } from './read-head';

const acceptSocket = async (socket: Duplex, peer: Peer, deps: { admin: AdminDeps; limiter: RateLimiter }) => {
  const head = await readHead(socket);
  const key = head.headers['sec-websocket-key'];
  if (head.headers.upgrade?.toLowerCase() !== 'websocket' || !key) {
    socket.end(UPGRADE_REQUIRED);
    return;
  }
  if (head.path !== LOBBY_PATH && head.path !== ADMIN_PATH) {
    socket.end(NOT_FOUND);
    return;
  }
  socket.write(upgradeResponse(key));
  const transport = createSocketTransport(socket);
  socket.resume();
  if (head.path === ADMIN_PATH) createAdminConnection(deps.admin, transport, peer);
  else createLobbyConnection({ protocol: deps.admin.service.protocol, limiter: deps.limiter, transport, address: peer.address, keepAlive: transport });
};

export { acceptSocket };
