/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import { newestFirst } from './newest-first';

const mergeLobby = (lobbies: readonly AdminLobby[] = [], lobby: AdminLobby): AdminLobby[] => {
  const known = lobbies.find((entry) => entry.id === lobby.id);
  if (known && known.rev > lobby.rev) return [...lobbies];
  return [lobby, ...lobbies.filter((entry) => entry.id !== lobby.id)].sort(newestFirst);
};

export { mergeLobby };
