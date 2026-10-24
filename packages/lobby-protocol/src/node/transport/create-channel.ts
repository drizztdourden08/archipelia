/* @layer protocol @kind logic */
import type { Channel, TransportEvent, TransportHandler } from './transport.type';

const createChannel = (): Channel => {
  let handler: TransportHandler | null = null;
  const buffered: TransportEvent[] = [];

  const emit: TransportHandler = (event) => {
    if (handler) handler(event);
    else buffered.push(event);
  };

  const listen = (next: TransportHandler) => {
    handler = next;
    for (const event of buffered.splice(0)) next(event);
  };

  return { emit, listen };
};

export { createChannel };
