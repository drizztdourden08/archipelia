/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';

const unlockLobby = async (ctx: LobbyContext, lobbyId: string) => {
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    if (draft.phase !== 'locked') throw new Error(`the lobby is ${draft.phase} and cannot unlock`);
    draft.phase = 'open';
  });
  ctx.publish(lobby);
  return lobby;
};

export { unlockLobby };
