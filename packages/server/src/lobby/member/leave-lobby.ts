/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { dropFiles } from './drop-files';
import { NORMAL_CLOSE } from './member.constants';

const leaveLobby = async (ctx: LobbyContext, ref: MemberRef) => {
  const before = await ctx.book.get(ref.lobbyId);
  if (before) await dropFiles(ctx.deps.store, before, ref.memberId);
  const lobby = await ctx.book.commit(ref.lobbyId, (draft) => {
    draft.members = draft.members.filter((member) => member.id !== ref.memberId);
    draft.worlds = draft.worlds.filter((world) => world.memberId !== ref.memberId);
  });
  ctx.hub.close(ref, NORMAL_CLOSE);
  ctx.publish(lobby);
};

export { leaveLobby };
