/* @layer electron-main @kind logic */
import type { LiveTab } from '../../src/live/live.type';
import type { LiveServiceDeps } from './live.type';

const reachesOut = (tab: LiveTab | undefined): boolean => tab !== undefined && tab.lan && tab.direct;

const settleNetwork = async (deps: LiveServiceDeps, before: LiveTab | undefined, after: LiveTab | undefined): Promise<void> => {
  if (reachesOut(before) && !reachesOut(after)) await deps.closer.quietIfIdle();
};

export { settleNetwork };
