/* @layer electron-main @kind logic */
import { createLocalHost } from '@archipelia/hosts';
import { ENGINE_TEXT } from '../engine-text.constants';
import { freePort } from './free-port';
import { SMOKE_BIND, SMOKE_HOST_MS, SMOKE_SERVER, SMOKE_STOP_MS } from './smoke.constants';
import type { HostRequest } from './smoke.type';

const hostSmokeSeed = async ({ runtime, dir, seedFile, signal, log }: HostRequest): Promise<void> => {
  const port = await freePort(SMOKE_BIND);
  const host = createLocalHost({ runtime, port, bindHost: SMOKE_BIND, advertiseHost: SMOKE_BIND, stopTimeoutMs: SMOKE_STOP_MS });
  const off = host.onLog((line) => log(line.text));
  const timeout = AbortSignal.timeout(SMOKE_HOST_MS);
  try {
    await host.start({ sessionId: 'smoke', sessionDir: dir, seedFile, server: SMOKE_SERVER, signal: AbortSignal.any([signal, timeout]) });
    await host.stop();
  } catch (err) {
    await host.stop().catch(() => undefined);
    if (timeout.aborted && !signal.aborted) throw new Error(ENGINE_TEXT.hostTimeout, { cause: err });
    throw err;
  } finally {
    off();
  }
};

export { hostSmokeSeed };
