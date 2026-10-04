/* @layer renderer-app @kind hook */
import type { Session } from '@archipelia/model';
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { RunsState } from './runs-store.type';
import { archipeliaApi } from '../ipc/archipelia-api';
import { MAX_LOG } from './runs-store.constants';

const upsert = (runs: Session[], session: Session) =>
  [session, ...runs.filter((run) => run.id !== session.id)].sort((a, b) => b.createdAt - a.createdAt);

const useRunsStore = createSessionStore<RunsState>((set, get) => ({
  runs: [],
  loaded: false,
  progress: {},
  logs: {},
  generateLines: {},
  load: async () => set({ runs: await archipeliaApi().sessionsList(), loaded: true }),
  run: (template) => archipeliaApi().sessionsRun(template),
  stop: async (id) => { await archipeliaApi().sessionsStop(id); },
  cancel: (id) => archipeliaApi().sessionsCancel(id),
  command: (id, cmd) => archipeliaApi().sessionsCommand(id, cmd),
  loadLog: async (id) => {
    const lines = await archipeliaApi().sessionsLog(id);
    set((s) => ({ logs: { ...s.logs, [id]: lines } }));
  },
  remove: async (id) => {
    await archipeliaApi().sessionsRemove(id);
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
