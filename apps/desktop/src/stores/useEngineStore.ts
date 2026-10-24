/* @layer renderer-app @kind hook */
import { createSessionStore, jobs } from '@drizztdourden08/brock-react';
import type { EngineOverview } from '@archipelia/model';
import type { EngineState } from './engine-store.type';
import { appApi } from '../ipc/app-api';
import { ENGINE_JOB } from '../jobs/jobs.constants';

const useEngineStore = createSessionStore<EngineState>((set, get) => {
  const keep = (overview: EngineOverview) => set({ overview, status: overview.status });
  return {
    status: null,
    overview: null,
    refresh: async () => set({ status: await appApi().engineStatus() }),
    setup: async () => {
      set((s) => ({ status: s.status && { ...s.status, state: 'building' } }));
      jobs.open(ENGINE_JOB);
      set({ status: await appApi().engineSetup() });
    },
    load: async (force = false) => keep(await appApi().engineOverview(force)),
    install: async (choice) => {
      jobs.open(ENGINE_JOB);
      const result = await appApi().engineInstall(choice);
      await get().load();
      return result;
    },
    switchTo: async (id) => keep(await appApi().engineSwitch(id)),
    remove: async (id) => keep(await appApi().engineRemove(id)),
    apply: (event) => keep(event.overview),
  };
});

export { useEngineStore };
