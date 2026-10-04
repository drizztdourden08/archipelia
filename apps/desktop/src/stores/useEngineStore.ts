/* @layer renderer-app @kind hook */
import { createSessionStore, jobs } from '@drizztdourden08/brock-react';
import type { EngineState } from './engine-store.type';
import { appApi } from '../ipc/app-api';
import { ENGINE_JOB } from '../jobs/jobs.constants';

const useEngineStore = createSessionStore<EngineState>((set) => ({
  status: null,
  refresh: async () => set({ status: await appApi().engineStatus() }),
  setup: async () => {
    set((s) => ({ status: s.status && { ...s.status, state: 'building' } }));
    jobs.open(ENGINE_JOB);
    set({ status: await appApi().engineSetup() });
  },
}));

export { useEngineStore };
