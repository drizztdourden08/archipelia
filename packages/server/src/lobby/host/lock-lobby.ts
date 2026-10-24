/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import { LOCKABLE_PHASES } from './host.constants';

const lockLobby = async (ctx: LobbyContext, lobbyId: string) => {
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    if (!LOCKABLE_PHASES.includes(draft.phase)) throw new Error(`the lobby is ${draft.phase} and cannot lock`);
    draft.phase = 'locked';
  });
  ctx.publish(lobby);
  return lobby;
};

export { lockLobby };
