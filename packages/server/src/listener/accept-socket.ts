/* @layer core @kind logic */
import type { Duplex } from 'node:stream';
import { LOBBY_PATH, PRE_WELCOME_MAX_MESSAGE_BYTES } from '@archipelia/lobby-protocol';
import { createSocketTransport, upgradeResponse } from '@archipelia/lobby-protocol/node';
import { createLobbyConnection } from '../lobby/link/create-lobby-connection';
import { ADMIN_MAX_BYTES } from './admin/admin.constants';
import { createAdminConnection } from './admin/create-admin-connection';
import { ADMIN_PATH, NOT_FOUND, UPGRADE_REQUIRED } from './listener.constants';
import type { AcceptDeps, Peer } from './listener.type';
import { readHead } from './read-head';

const acceptSocket = async (socket: Duplex, peer: Peer, deps: AcceptDeps) => {
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
  deps.upgraded();
  const limit = { bytes: head.path === ADMIN_PATH ? ADMIN_MAX_BYTES : PRE_WELCOME_MAX_MESSAGE_BYTES };
  const transport = createSocketTransport(socket, { maxMessageBytes: () => limit.bytes });
  if (head.path === ADMIN_PATH) createAdminConnection({ ...deps.admin, limiter: deps.limiter }, transport, peer);
  else createLobbyConnection({ protocol: deps.admin.service.protocol, limiter: deps.limiter, transport, address: peer.address, keepAlive: transport, limit, drained: transport.drained, log: deps.log });
  socket.resume();
};

export { acceptSocket };
