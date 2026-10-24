/* @layer core @kind logic */
import type { LobbyFailure } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { sendApproved } from '../member/send-approved';

const failLobby = async (ctx: LobbyContext, lobbyId: string, failure: LobbyFailure) => {
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    draft.phase = 'failed';
    draft.failure = failure;
  });
  ctx.deps.log(`lobby ${lobby.name}: ${failure.stage} failed: ${failure.message}`);
  ctx.publish(lobby);
  sendApproved(ctx.hub, lobby, { type: 'lobby.failed', stage: failure.stage, message: failure.message });
  return lobby;
};

export { failLobby };
