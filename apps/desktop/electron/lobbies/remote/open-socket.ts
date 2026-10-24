/* @layer electron-main @kind logic */
import type { Socket } from 'node:net';
import { connect as connectPlain, isIP } from 'node:net';
import { connect as connectTls } from 'node:tls';
import type { ServerTarget } from '../../../src/lobbies/lobbies.type';
import { normalizePin } from '../../../src/lobbies/normalize-pin';
import { certificateSha256 } from './certificate-sha256';
import { CONNECT_TIMEOUT_MS } from './remote.constants';

const wrongPin = (seen: string) =>
  Object.assign(new Error('The server certificate is not the one that was trusted for this server.'), { sha256: seen });

const openTls = (target: ServerTarget, pin: string | undefined): Promise<Socket> =>
  new Promise((resolve, reject) => {
    const socket = connectTls({
      host: target.host, port: target.port, rejectUnauthorized: pin === undefined,
      ...(isIP(target.host) === 0 ? { servername: target.host } : {}),
    });
    socket.setTimeout(CONNECT_TIMEOUT_MS, () => socket.destroy(new Error('The server did not answer in time.')));
    socket.once('error', reject);
    socket.once('secureConnect', () => {
      socket.setTimeout(0);
      const seen = certificateSha256(socket);
      if (pin !== undefined && normalizePin(pin) !== seen) {
        socket.destroy();
        reject(wrongPin(seen));
        return;
      }
      resolve(socket);
    });
  });

const openPlain = (target: ServerTarget): Promise<Socket> =>
  new Promise((resolve, reject) => {
    const socket = connectPlain({ host: target.host, port: target.port });
    socket.setTimeout(CONNECT_TIMEOUT_MS, () => socket.destroy(new Error('The server did not answer in time.')));
    socket.once('error', reject);
    socket.once('connect', () => {
      socket.setTimeout(0);
      resolve(socket);
    });
  });

const openSocket = (target: ServerTarget, pin?: string): Promise<Socket> => (target.secure ? openTls(target, pin) : openPlain(target));

export { openSocket };
