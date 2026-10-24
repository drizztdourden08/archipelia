/* @layer electron-main @kind logic */
import { connect } from 'node:tls';
import { isIP } from 'node:net';
import type { ServerTarget } from '../../../src/lobbies/lobbies.type';
import { certificateSha256 } from './certificate-sha256';
import { CONNECT_TIMEOUT_MS } from './remote.constants';

const probeCertificate = (target: ServerTarget): Promise<string> =>
  new Promise((resolve, reject) => {
    const socket = connect({ host: target.host, port: target.port, rejectUnauthorized: false, ...(isIP(target.host) === 0 ? { servername: target.host } : {}) });
    socket.setTimeout(CONNECT_TIMEOUT_MS, () => socket.destroy(new Error('The server did not answer in time.')));
    socket.once('error', reject);
    socket.once('secureConnect', () => {
      const sha256 = certificateSha256(socket);
      socket.destroy();
      resolve(sha256);
    });
  });

export { probeCertificate };
