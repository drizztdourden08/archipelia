/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { RunLaunchState } from './run-launch-store.type';

const useRunLaunchStore = createSessionStore<RunLaunchState>((set) => ({
  launch: null,
  begin: (launch) => set({ launch }),
}));

export { useRunLaunchStore };
