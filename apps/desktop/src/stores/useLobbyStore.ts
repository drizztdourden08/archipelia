/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import type { LobbyState } from './lobby-store.type';
import { mergeLobby } from './merge-lobby';
import { newestFirst } from './newest-first';

const useLobbyStore = createSessionStore<LobbyState>((set, get) => ({
  serverId: LOCAL_SERVER,
  lobbies: {},
  select: (serverId) => set({ serverId }),
  load: async (serverId) => {
    const lobbies = await appApi().lobbyList(serverId);
    set((state) => ({ lobbies: { ...state.lobbies, [serverId]: [...lobbies].sort(newestFirst) } }));
  },
  act: async (serverId, request) => {
    const lobby = await appApi().lobbyAct(serverId, request);
    get().apply({ serverId, lobby });
    return lobby;
  },
  apply: ({ serverId, lobby }) => set((state) => ({ lobbies: { ...state.lobbies, [serverId]: mergeLobby(state.lobbies[serverId], lobby) } })),
}));

export { useLobbyStore };
