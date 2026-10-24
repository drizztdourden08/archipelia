/* @layer testing @kind logic */
import { createHash } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import type { Transport } from './transport.type';
import { LOBBY_PATH } from '../../protocol/protocol.constants';
import { createSocketTransport } from './create-socket-transport';
import { WEBSOCKET_GUID } from './websocket.constants';

const acceptKeyFor = (key: string): string => createHash('sha1').update(key + WEBSOCKET_GUID).digest('base64');

const acceptUpgrade = (request: IncomingMessage, socket: Duplex, onConnection: (transport: Transport) => void) => {
  const key = request.headers['sec-websocket-key'];
  if (request.url !== LOBBY_PATH || typeof key !== 'string') {
    socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
    return;
  }
  const lines = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKeyFor(key)}`,
  ];
  socket.write(`${lines.join('\r\n')}\r\n\r\n`);
  onConnection(createSocketTransport(socket));
};

export { acceptUpgrade };
