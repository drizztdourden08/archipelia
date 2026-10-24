/* @layer electron-main @kind logic */
import { createHash } from 'node:crypto';
import type { TLSSocket } from 'node:tls';

const certificateSha256 = (socket: TLSSocket): string => {
  const { raw } = socket.getPeerCertificate();
  return createHash('sha256').update(raw).digest('hex');
};

export { certificateSha256 };
