/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';

const runOfLobby = (runs: readonly Session[], lobbyId: string | undefined): Session | undefined =>
  (lobbyId ? runs.filter((run) => run.lobbyId === lobbyId).sort((a, b) => b.createdAt - a.createdAt)[0] : undefined);

export { runOfLobby };
