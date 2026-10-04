/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { EngineState } from './engine-store.type';
import { appApi } from '../ipc/app-api';
import { MAX_LINES } from './engine-store.constants';

const useEngineStore = createSessionStore<EngineState>((set) => ({
  status: null,
  lines: [],
  refresh: async () => set({ status: await appApi().engineStatus() }),
  setup: async () => {
    const off = appApi().onEngineProgress((line) => set((s) => ({ lines: [...s.lines, line].slice(-MAX_LINES) })));
    set((s) => ({ lines: [], status: s.status && { ...s.status, state: 'building' } }));
    try {
      set({ status: await appApi().engineSetup() });
    } finally {
      off();
    }
  },
}));

export { useEngineStore };
