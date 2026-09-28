/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { FocusState } from './focus-store.type';

const useFocusStore = createSessionStore<FocusState>((set) => ({
  sessionId: '',
  focus: (sessionId) => set({ sessionId }),
}));

export { useFocusStore };
