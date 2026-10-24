/* @layer testing @kind logic */
import type { Transport } from '../../node/transport/transport.type';
import type { FakeServer, FakeServerOptions } from './fake.type';
import { createQueue } from '../play/create-queue';
import { playScript } from '../play/play-script';
import { listenWebSocket } from '../transport/listen-websocket';
import { DEFAULT_TIMEOUT_MS } from './fake.constants';

const createFakeServer = (options: FakeServerOptions): FakeServer => {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const connections = createQueue<Transport>(timeoutMs, 'a client to connect');

  const done = playScript({
    role: 'server',
    lines: options.scenario.lines,
    values: options.values ?? {},
    files: [],
    timeoutMs,
    ignore: [],
    io: {
      open: () => connections.pull(),
      reopen: (current) => {
        current.close(1000);
        return connections.pull();
      },
    },
  });

  const listen = (port?: number, host?: string) =>
    listenWebSocket({ port, host, onConnection: connections.push });

  return { attach: connections.push, listen, done };
};

export { createFakeServer };
