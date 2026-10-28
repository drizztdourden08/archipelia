/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { SessionPickState } from './session-pick-store.type';

const useSessionPickStore = createSessionStore<SessionPickState>((set) => ({
  selectedId: null,
  dirty: false,
  select: (selectedId) => set({ selectedId, dirty: false }),
  setDirty: (dirty) => set({ dirty }),
}));

export { useSessionPickStore };
