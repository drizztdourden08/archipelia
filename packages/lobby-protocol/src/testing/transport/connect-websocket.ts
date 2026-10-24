/* @layer testing @kind logic */
import type { Transport } from '../../node/transport/transport.type';
import { createChannel } from '../../node/transport/create-channel';

const usableCode = (code: number): number => (code === 1000 || (code >= 3000 && code <= 4999) ? code : 1000);

const connectWebSocket = (url: string): Promise<Transport> =>
  new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    const channel = createChannel();
    socket.addEventListener('message', (event) => {
      const data: unknown = event.data;
      if (typeof data === 'string') channel.emit({ kind: 'text', text: data });
      else if (data instanceof ArrayBuffer) channel.emit({ kind: 'binary', bytes: new Uint8Array(data) });
    });
    socket.addEventListener('close', (event) => channel.emit({ kind: 'close', code: event.code }));
    socket.addEventListener('error', () => reject(new Error(`could not connect to ${url}`)));
    socket.addEventListener('open', () =>
      resolve({
        send: (text) => socket.send(text),
        sendBinary: (bytes) => socket.send(bytes),
        close: (code = 1000) => socket.close(usableCode(code)),
        listen: channel.listen,
      }),
    );
  });

export { connectWebSocket };
