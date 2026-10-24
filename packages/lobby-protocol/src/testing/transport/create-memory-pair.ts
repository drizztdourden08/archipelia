/* @layer testing @kind logic */
import type { Channel, Transport } from '../../node/transport/transport.type';
import { createChannel } from '../../node/transport/create-channel';

const createMemoryPair = (): [Transport, Transport] => {
  let open = true;

  const endpoint = (inbound: Channel, outbound: Channel): Transport => ({
    send: (text) => {
      if (open) queueMicrotask(() => outbound.emit({ kind: 'text', text }));
    },
    sendBinary: (bytes) => {
      if (open) queueMicrotask(() => outbound.emit({ kind: 'binary', bytes }));
    },
    close: (code = 1000) => {
      if (!open) return;
      open = false;
      queueMicrotask(() => {
        outbound.emit({ kind: 'close', code });
        inbound.emit({ kind: 'close', code });
      });
    },
    listen: inbound.listen,
  });

  const left = createChannel();
  const right = createChannel();
  return [endpoint(left, right), endpoint(right, left)];
};

export { createMemoryPair };
