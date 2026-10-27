/* @layer electron-main @kind logic */
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import type { LiveStart } from '../../src/live/live.type';
import { closeLive } from './close-live';
import { dropSession } from './drop-session';
import type { LiveServiceDeps } from './live.type';
import { runLive } from './run-live';
import { settleLiveTabs } from './settle-live-tabs';
import { startLive } from './start-live';
import { withLiveLobby } from './with-live-lobby';

const createLiveService = (deps: LiveServiceDeps) => {
  const starting = new Map<string, Promise<LiveStart>>();
  const running = new Map<string, Promise<AdminLobby>>();

  const start = (sessionId: string, overrides?: unknown): Promise<LiveStart> => {
    const known = starting.get(sessionId);
    if (known) return known;
    const next = startLive(deps, sessionId, overrides).finally(() => starting.delete(sessionId));
    starting.set(sessionId, next);
    return next;
  };

  const run = (tabId: string): Promise<AdminLobby> => {
    const known = running.get(tabId);
    if (known) return known;
    const next = runLive(deps, tabId).finally(() => running.delete(tabId));
    running.set(tabId, next);
    return next;
  };

  return {
    list: deps.store.list,
    start,
    run,
    close: (tabId: string, mode: unknown) => closeLive(deps, tabId, mode),
    dropSession: (sessionId: string) => dropSession(deps, sessionId),
    settle: () => settleLiveTabs(deps),
    attachRun: deps.store.attachRun,
    withTabs: async (templates: SessionTemplate[]) => withLiveLobby(templates, await deps.store.list()),
  };
};

export { createLiveService };
