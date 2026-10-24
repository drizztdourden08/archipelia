/* @layer core @kind logic */
import type { Duplex } from 'node:stream';
import { HEAD_END, MAX_HEAD_BYTES } from './listener.constants';
import type { RequestHead } from './listener.type';

const parseHead = (text: string): RequestHead => {
  const [requestLine = '', ...lines] = text.split('\r\n');
  const [method = '', path = ''] = requestLine.split(' ');
  const headers: Record<string, string> = {};
  for (const line of lines) {
    const colon = line.indexOf(':');
    if (colon > 0) headers[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
  }
  return { method, path, headers };
};

const readHead = (socket: Duplex): Promise<RequestHead> =>
  new Promise((resolve, reject) => {
    let buffered = Buffer.alloc(0);
    const onData = (chunk: Buffer) => {
      buffered = Buffer.concat([buffered, chunk]);
      const end = buffered.indexOf(HEAD_END);
      if (end < 0 && buffered.length < MAX_HEAD_BYTES) return;
      socket.off('data', onData);
      socket.off('error', reject);
      socket.pause();
      if (end < 0) return reject(new Error('the request head is too large'));
      const rest = buffered.subarray(end + HEAD_END.length);
      if (rest.length > 0) socket.unshift(rest);
      return resolve(parseHead(buffered.subarray(0, end).toString('latin1')));
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });

export { readHead };
