/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import type { LiveState } from './live-store.type';

const useLiveStore = createSessionStore<LiveState>((set) => ({
  tabs: [],
  load: async () => set({ tabs: await appApi().liveList() }),
  apply: (tabs) => set({ tabs }),
}));

export { useLiveStore };
