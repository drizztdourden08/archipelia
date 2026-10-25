/* @layer electron-main @kind logic */
import type { SocketTransport } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { JoinTiming } from './joins.type';

const keepAlive = (transport: Pick<SocketTransport, 'ping' | 'heardAt'>, timing: Pick<JoinTiming, 'pingMs' | 'idleMs'>, onIdle: () => void, now: () => number = Date.now) => {
  const timer = setInterval(() => {
    if (now() - transport.heardAt() > timing.idleMs) onIdle();
    else transport.ping();
  }, timing.pingMs);
  timer.unref();
  return () => clearInterval(timer);
};

export { keepAlive };
