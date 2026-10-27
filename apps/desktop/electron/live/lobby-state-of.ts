/* @layer electron-main @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { LiveServiceDeps } from './live.type';
import type { FoundLobby } from './lobby-state-of.type';

const lobbyStateOf = (deps: LiveServiceDeps) => {
  const lists = new Map<string, Promise<AdminLobby[] | undefined>>();
  const listOf = (serverId: string) => {
    const known = lists.get(serverId);
    if (known) return known;
    const fresh = deps.lobbies(serverId).then((ops) => ops.list()).catch(() => undefined);
    lists.set(serverId, fresh);
    return fresh;
  };
  return async (serverId: string, lobbyId: string): Promise<FoundLobby> => {
    const lobbies = await listOf(serverId);
    if (!lobbies) return { state: 'unknown' };
    const lobby = lobbies.find((entry) => entry.id === lobbyId);
    return lobby && lobby.phase !== 'closed' ? { state: 'alive', lobby } : { state: 'gone' };
  };
};

export { lobbyStateOf };
