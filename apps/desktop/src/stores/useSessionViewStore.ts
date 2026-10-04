/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { EMPTY_SESSION_VIEW } from './session-view-store.constants';
import type { SessionViewState } from './session-view-store.type';

const useSessionViewStore = createSessionStore<SessionViewState>((set) => ({
  ...EMPTY_SESSION_VIEW,
  show: ({ session, lines, loaded }) => set({ session, lines, loaded }),
}));

export { useSessionViewStore };
