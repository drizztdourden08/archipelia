/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { EngineState } from './engine-store.type';
import { archipeliaApi } from '../ipc/archipelia-api';
import { MAX_LINES } from './engine-store.constants';

const useEngineStore = createSessionStore<EngineState>((set) => ({
  status: null,
  lines: [],
  refresh: async () => set({ status: await archipeliaApi().engineStatus() }),
  setup: async () => {
    const off = archipeliaApi().onEngineProgress((line) => set((s) => ({ lines: [...s.lines, line].slice(-MAX_LINES) })));
    set((s) => ({ lines: [], status: s.status && { ...s.status, state: 'building' } }));
    try {
      set({ status: await archipeliaApi().engineSetup() });
    } finally {
      off();
    }
  },
}));

export { useEngineStore };
