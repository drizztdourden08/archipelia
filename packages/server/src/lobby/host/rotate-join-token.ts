/* @layer core @kind logic */
import { newToken } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { LobbyContext } from '../lobby-context.type';

const rotateJoinToken = async (ctx: LobbyContext, lobbyId: string) => {
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    if (draft.options.listed !== true) throw new Error('the lobby is not shown on the network, so it has no join token');
    draft.joinToken = newToken();
  });
  ctx.publish(lobby);
  return lobby;
};

export { rotateJoinToken };
