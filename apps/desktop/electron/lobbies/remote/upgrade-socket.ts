/* @layer electron-main @kind logic */
import { createHash, randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
import type { ServerTarget } from '../../../src/lobbies/lobbies.type';
import { ADMIN_PATH, CONNECT_TIMEOUT_MS, HEAD_END, KEY_BYTES, MAX_HEAD_BYTES, TIMEOUT_TEXT, WEBSOCKET_GUID } from './remote.constants';

const requestFor = (target: ServerTarget, key: string): string =>
  [
    `GET ${ADMIN_PATH} HTTP/1.1`, `Host: ${target.host}:${target.port}`, 'Upgrade: websocket', 'Connection: Upgrade',
    `Sec-WebSocket-Key: ${key}`, 'Sec-WebSocket-Version: 13', '', '',
  ].join('\r\n');

const acceptOf = (key: string): string => createHash('sha1').update(key + WEBSOCKET_GUID).digest('base64');

const refusal = (head: string): Error => new Error(`The server did not accept the admin connection (${head.split('\r\n')[0] ?? 'no answer'}).`);

const upgradeSocket = (socket: Socket, target: ServerTarget): Promise<void> =>
  new Promise((resolve, reject) => {
    const key = randomBytes(KEY_BYTES).toString('base64');
    let buffered = Buffer.alloc(0);
    const timer = setTimeout(() => fail(new Error(TIMEOUT_TEXT)), CONNECT_TIMEOUT_MS);
    const fail = (error: Error) => {
      clearTimeout(timer);
      socket.off('data', onData);
      socket.destroy();
      reject(error);
    };
    const onData = (chunk: Buffer) => {
      buffered = Buffer.concat([buffered, chunk]);
      const end = buffered.indexOf(HEAD_END);
      if (end < 0) {
        if (buffered.length > MAX_HEAD_BYTES) fail(new Error('The server answer is too large.'));
        return;
      }
      socket.off('data', onData);
      const head = buffered.subarray(0, end).toString('latin1');
      if (!head.startsWith('HTTP/1.1 101') || !head.includes(acceptOf(key))) {
        fail(refusal(head));
        return;
      }
      socket.off('error', fail);
      clearTimeout(timer);
      const rest = buffered.subarray(end + HEAD_END.length);
      if (rest.length > 0) socket.unshift(rest);
      resolve();
    };
    socket.on('data', onData);
    socket.once('error', fail);
    socket.write(requestFor(target, key));
  });

export { upgradeSocket };
