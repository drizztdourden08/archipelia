/* @layer renderer-app @kind hook */
import { createSessionStore } from '@drizztdourden08/brock-react';
import { lobbyEventsOf } from '../lobbies/lobby-events-of';
import { LOG_LIMIT } from '../lobbies/lobby-events.constants';
import type { LobbyLogState } from './lobby-log-store.type';

const useLobbyLogStore = createSessionStore<LobbyLogState>((set) => ({
  seen: {},
  lines: {},
  record: (lobby, at) => set((state) => {
    const known = state.seen[lobby.id];
    if (known && known.rev >= lobby.rev) return state;
    const added = lobbyEventsOf(known, lobby, at);
    const lines = [...(state.lines[lobby.id] ?? []), ...added].slice(-LOG_LIMIT);
    return { seen: { ...state.seen, [lobby.id]: lobby }, lines: { ...state.lines, [lobby.id]: lines } };
  }),
}));

export { useLobbyLogStore };
