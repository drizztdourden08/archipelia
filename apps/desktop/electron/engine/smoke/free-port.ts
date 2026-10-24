/* @layer electron-main @kind logic */
import { createServer } from 'node:net';
import type { AddressInfo } from 'node:net';

const freePort = (host: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, host, () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });
  });

export { freePort };
