/* @layer core @kind logic */
import type { AdminLobby, Lobby } from '@archipelia/model';

const adminView = (lobby: Lobby | undefined): AdminLobby | null => {
  if (!lobby) return null;
  return {
    ...lobby,
    members: lobby.members.map(({ tokenHash: _tokenHash, ...member }) => member),
    worlds: lobby.worlds.map(({ proof, ...world }) => ({ ...world, proofSent: proof !== undefined })),
  };
};

export { adminView };
