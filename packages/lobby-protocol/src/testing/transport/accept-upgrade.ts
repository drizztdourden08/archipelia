/* @layer testing @kind logic */
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import type { Transport } from '../../node/transport/transport.type';
import { LOBBY_PATH } from '../../protocol/protocol.constants';
import { createSocketTransport } from '../../node/transport/create-socket-transport';
import { upgradeResponse } from '../../node/transport/upgrade-response';

const acceptUpgrade = (request: IncomingMessage, socket: Duplex, onConnection: (transport: Transport) => void) => {
  const key = request.headers['sec-websocket-key'];
  if (request.url !== LOBBY_PATH || typeof key !== 'string') {
    socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
    return;
  }
  socket.write(upgradeResponse(key));
  onConnection(createSocketTransport(socket));
};

export { acceptUpgrade };
