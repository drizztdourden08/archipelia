/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import type { TabDraftState } from './tab-draft-store.type';

const useTabDraftStore = createSessionStore<TabDraftState>((set) => ({
  players: {},
  setPlayers: (tabId, players) => set((state) => ({ players: { ...state.players, [tabId]: players } })),
  clear: (tabId) => set((state) => {
    const { [tabId]: _dropped, ...rest } = state.players;
    return { players: rest };
  }),
}));

export { useTabDraftStore };
