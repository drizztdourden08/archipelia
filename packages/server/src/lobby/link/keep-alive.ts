/* @layer core @kind logic */
import { IDLE_TIMEOUT_MS, PING_INTERVAL_MS } from '@archipelia/lobby-protocol';
import type { LobbyLink } from '../lobby-service.type';
import { GOING_AWAY } from './link.constants';
import type { KeepAlive } from './link.type';

const keepAlive = (alive: KeepAlive | undefined, link: LobbyLink): (() => void) => {
  if (!alive) return () => undefined;
  const timer = setInterval(() => {
    if (Date.now() - alive.heardAt() > IDLE_TIMEOUT_MS) link.close(GOING_AWAY);
    else alive.ping();
  }, PING_INTERVAL_MS);
  timer.unref();
  return () => clearInterval(timer);
};

export { keepAlive };
