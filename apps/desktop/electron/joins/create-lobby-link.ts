/* @layer electron-main @kind logic */
import { decodeMessage, DEFAULT_LIMITS } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Transport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import { REPLY_TIMEOUT_MS, UPLOAD_TIMEOUT_MS } from './joins.constants';
import type { LinkMessage, LobbyLink } from './joins.type';
import { createWaiterBook } from './create-waiter-book';
import { replyTo } from './reply-to';

const parse = (text: string): LinkMessage | null => {
  const outcome = decodeMessage(text, { direction: 's2c', maxBytes: DEFAULT_LIMITS.maxMessageBytes });
  return outcome.ok && outcome.known ? outcome.message : null;
};

const isFatal = (message: LinkMessage) => message.type === 'error' && message.fatal;

const createLobbyLink = (transport: Transport): LobbyLink => {
  const book = createWaiterBook();
  const listeners = new Set<(message: LinkMessage) => void>();
  const closers: ((code: number) => void)[] = [];
  let seq = 0;

  transport.listen((event) => {
    if (event.kind === 'close') {
      book.closeAll();
      for (const closer of closers) closer(event.code);
      return;
    }
    const message = event.kind === 'text' ? parse(event.text) : null;
    if (!message) return;
    for (const listener of listeners) listener(message);
    book.take(message);
  });

  const send = (message: Record<string, unknown>) => transport.send(JSON.stringify(message));

  const onMessage = (listener: (message: LinkMessage) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const request = (message: Record<string, unknown>) => {
    seq += 1;
    const id = seq;
    const reply = book.waitFor((answer) => replyTo(answer) === id || isFatal(answer), REPLY_TIMEOUT_MS);
    send({ ...message, seq: id });
    return reply;
  };

  const stream = async (message: Record<string, unknown>, isEnd: (message: LinkMessage) => boolean) => {
    seq += 1;
    const id = seq;
    const parts: LinkMessage[] = [];
    const stop = onMessage((part) => { if (replyTo(part) === id) parts.push(part); });
    const end = book.waitFor((answer) => (replyTo(answer) === id && isEnd(answer)) || isFatal(answer), UPLOAD_TIMEOUT_MS);
    send({ ...message, seq: id });
    try {
      const last = await end;
      return [...parts, last];
    } finally {
      stop();
    }
  };

  return { send, request, stream, waitFor: book.waitFor, onMessage, onClose: (listener) => closers.push(listener), close: (code) => transport.close(code) };
};

export { createLobbyLink };
