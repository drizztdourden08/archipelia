/* @layer electron-main @kind logic */
import { newId } from '@drizztdourden08/brock-core/storage';
import type { LiveTab } from '../../src/live/live.type';
import { LIVE_FILE } from './live.constants';
import type { LiveDeps, TabInput } from './live.type';

const createLiveSessions = ({ files, emit, now = Date.now, id = newId }: LiveDeps) => {
  let queue: Promise<unknown> = Promise.resolve();
  const list = () => files.readJson<LiveTab[]>(LIVE_FILE, []);

  const change = <T>(edit: (tabs: LiveTab[]) => { tabs: LiveTab[]; value: T }): Promise<T> => {
    const next = queue.then(async () => {
      const done = edit(await list());
      await files.writeJson(LIVE_FILE, done.tabs);
      return done;
    });
    queue = next.catch(() => undefined);
    return next.then((done) => {
      emit(done.tabs);
      return done.value;
    });
  };

  const get = async (tabId: string) => (await list()).find((tab) => tab.tabId === tabId);
  const forSession = async (sessionId: string) => (await list()).find((tab) => tab.sessionId === sessionId);

  const open = (input: TabInput) => change((tabs) => {
    const tab: LiveTab = { ...input, tabId: id(), openedAt: now() };
    return { tabs: [...tabs, tab], value: tab };
  });

  const patch = (tabId: string, edit: Partial<Omit<LiveTab, 'tabId'>>) => change((tabs) => {
    const next = tabs.map((tab) => (tab.tabId === tabId ? { ...tab, ...edit } : tab));
    return { tabs: next, value: next.find((tab) => tab.tabId === tabId) };
  });

  const attachRun = async (lobbyId: string, runId: string): Promise<void> => {
    if (!(await list()).some((tab) => tab.lobbyId === lobbyId && tab.runId !== runId)) return;
    await change((tabs) => ({ tabs: tabs.map((tab) => (tab.lobbyId === lobbyId ? { ...tab, runId } : tab)), value: undefined }));
  };

  const remove = (tabId: string) => change((tabs) => ({ tabs: tabs.filter((tab) => tab.tabId !== tabId), value: undefined }));

  return { list, get, forSession, open, patch, attachRun, remove };
};

export { createLiveSessions };
