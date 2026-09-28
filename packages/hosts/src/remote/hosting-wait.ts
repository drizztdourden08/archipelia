/* @layer core @kind logic */
import type { LineSource } from '../gg-host/wait-for-line.type';
import type { StreamHandle } from './remote.type';
import { waitForLine } from '../gg-host/wait-for-line';
import { HOSTING } from './hosting-wait.constants';

const waitForHosting = async (source: LineSource, tail: StreamHandle, timeoutMs: number, since: number) => {
  const stopper = new AbortController();
  const hosting = waitForLine(source, { pattern: HOSTING, timeoutMs, what: 'MultiServer to start hosting', since, signal: stopper.signal });
  const exited = tail.done.then((code) => Promise.reject(new Error(`MultiServer exited before hosting (log stream closed with ${code})`)));
  try {
    const match = await Promise.race([hosting, exited]);
    return Number(match[1]);
  } finally {
    stopper.abort();
    hosting.catch(() => undefined);
    exited.catch(() => undefined);
  }
};

export { waitForHosting };
