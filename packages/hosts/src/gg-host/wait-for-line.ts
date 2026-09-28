/* @layer core @kind logic */
import type { LineSource, LineWait } from './wait-for-line.type';

const waitForLine = (source: LineSource, { pattern, timeoutMs, what, since = 0, signal }: LineWait) =>
  new Promise<RegExpMatchArray>((resolve, reject) => {
    let off = () => {};
    const finish = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      queueMicrotask(() => off());
    };
    const fail = (error: Error) => {
      finish();
      reject(error);
    };
    const abort = () => fail(new Error(`stopped waiting for ${what}`));
    const timer = setTimeout(() => fail(new Error(`timed out after ${timeoutMs} ms waiting for ${what}`)), timeoutMs);
    signal?.addEventListener('abort', abort, { once: true });
    off = source.subscribe(({ at, text }) => {
      const match = at >= since ? text.match(pattern) : null;
      if (!match) return;
      finish();
      resolve(match);
    });
  });

export { waitForLine };
