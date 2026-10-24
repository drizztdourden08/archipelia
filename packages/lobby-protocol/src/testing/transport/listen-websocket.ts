/* @layer testing @kind logic */
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Duplex } from 'node:stream';
import type { ListenOptions, WebSocketListener } from './transport.type';
import { LOBBY_PATH } from '../../protocol/protocol.constants';
import { acceptUpgrade } from './accept-upgrade';
import { LOOPBACK } from './listen-websocket.constants';

const listenWebSocket = (options: ListenOptions): Promise<WebSocketListener> =>
  new Promise((resolve, reject) => {
    const host = options.host ?? LOOPBACK;
    const server = createServer((_request, response) => {
      response.statusCode = 426;
      response.end();
    });
    const sockets = new Set<Duplex>();
    server.on('upgrade', (request, socket) => {
      sockets.add(socket);
      socket.once('close', () => sockets.delete(socket));
      acceptUpgrade(request, socket, options.onConnection);
    });
    server.once('error', reject);
    server.listen(options.port ?? 0, host, () => {
      const { port } = server.address() as AddressInfo;
      const stop = () =>
        new Promise<void>((done) => {
          for (const socket of sockets) socket.destroy();
          server.closeAllConnections();
          server.close(() => done());
        });
      resolve({ port, url: `ws://${host}:${port}${LOBBY_PATH}`, stop });
    });
  });

export { listenWebSocket };
