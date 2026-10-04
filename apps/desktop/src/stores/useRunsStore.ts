/* @layer renderer-app @kind hook */
import type { Session } from '@archipelia/model';
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { RunsState } from './runs-store.type';
import { appApi } from '../ipc/app-api';
import { MAX_LOG } from './runs-store.constants';

const upsert = (runs: Session[], session: Session) =>
  [session, ...runs.filter((run) => run.id !== session.id)].sort((a, b) => b.createdAt - a.createdAt);

const useRunsStore = createSessionStore<RunsState>((set, get) => ({
  runs: [],
  loaded: false,
  progress: {},
  logs: {},
  generateLines: {},
  load: async () => set({ runs: await appApi().sessionsList(), loaded: true }),
  run: (template) => appApi().sessionsRun(template),
  stop: async (id) => { await appApi().sessionsStop(id); },
  cancel: (id) => appApi().sessionsCancel(id),
  command: (id, cmd) => appApi().sessionsCommand(id, cmd),
  loadLog: async (id) => {
    const lines = await appApi().sessionsLog(id);
    set((s) => ({ logs: { ...s.logs, [id]: lines } }));
  },
  remove: async (id) => {
    await appApi().sessionsRemove(id);
    await get().load();
  },
  apply: (event) => {
    if (event.type === 'session') set((s) => ({ runs: upsert(s.runs, event.session) }));
    if (event.type === 'progress') set((s) => ({ progress: { ...s.progress, [event.sessionId]: event.progress } }));
    if (event.type === 'generate') {
      set((s) => ({ generateLines: { ...s.generateLines, [event.sessionId]: [...(s.generateLines[event.sessionId] ?? []), event.line].slice(-MAX_LOG) } }));
    }
    if (event.type === 'log') {
      set((s) => ({ logs: { ...s.logs, [event.sessionId]: [...(s.logs[event.sessionId] ?? []), event.line].slice(-MAX_LOG) } }));
    }
  },
}));

export { useRunsStore };
