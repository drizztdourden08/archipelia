/* @layer tests @kind helper */
import { connect } from 'node:tls';
import type { Seen } from './upgrade-over-tls.type';

const upgradeOverTls = (port: number): Promise<Seen> =>
  new Promise((resolve, reject) => {
    const socket = connect({ host: '127.0.0.1', port, rejectUnauthorized: false }, () => {
      const fingerprint = socket.getPeerCertificate().fingerprint256;
      socket.write([
        'GET /archipelia/lobby HTTP/1.1', `Host: 127.0.0.1:${port}`, 'Upgrade: websocket', 'Connection: Upgrade',
        'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==', 'Sec-WebSocket-Version: 13', '', '',
      ].join('\r\n'));
      socket.once('data', (chunk: Buffer) => {
        socket.destroy();
        resolve({ fingerprint, status: chunk.toString('utf8').split('\r\n')[0] ?? '' });
      });
    });
    socket.once('error', reject);
  });

export { upgradeOverTls };
