/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { enrichKey } from './enrich-key';
import type { EnrichState } from './enrich-store.type';

const useEnrichStore = createSessionStore<EnrichState>((set, get) => ({
  asked: {},
  found: {},
  ask: (request) => {
    const key = enrichKey(request);
    if (get().asked[key]) return;
    set((state) => ({ asked: { ...state.asked, [key]: true } }));
    void appApi().catalogEnrich(request).then(
      (found) => { if (found) set((state) => ({ found: { ...state.found, [key]: found } })); },
      () => undefined,
    );
  },
}));

export { useEnrichStore };
