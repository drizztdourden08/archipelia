/* @layer tests @kind test */
import type { Transport } from '@drizztdourden08/archipelia-lobby-protocol/testing';

const replies = (transport: Transport) => {
  const queue: Record<string, unknown>[] = [];
  const waiting: ((value: Record<string, unknown>) => void)[] = [];
  transport.listen((event) => {
    if (event.kind !== 'text') return;
    const message = JSON.parse(event.text) as Record<string, unknown>;
    const next = waiting.shift();
    if (next) next(message);
    else queue.push(message);
  });
  const take = () => new Promise<Record<string, unknown>>((resolve) => {
    const first = queue.shift();
    if (first) resolve(first);
    else waiting.push(resolve);
  });
  return async (type?: string): Promise<Record<string, unknown>> => {
    let message = await take();
    while (type !== undefined && message.type !== type) message = await take();
    return message;
  };
};

export { replies };
