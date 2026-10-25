/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { STATUS_FAILED } from '../hooks/lobby-hooks.constants';
import { logFailure } from '../hooks/log-failure';
import type { ServerStatusState } from './server-status-store.type';

const useServerStatusStore = createSessionStore<ServerStatusState>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
  reload: async () => {
    try {
      set({ status: await appApi().lobbyServerStatus() });
    } catch (error) {
      logFailure(STATUS_FAILED, error);
    }
  },
}));

export { useServerStatusStore };
