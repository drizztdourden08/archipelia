/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { NORMAL_CLOSE } from './member.constants';
import { pruneFiles } from './prune-files';

const leaveLobby = async (ctx: LobbyContext, ref: MemberRef) => {
  const lobby = await ctx.book.commit(ref.lobbyId, (draft) => {
    draft.members = draft.members.filter((member) => member.id !== ref.memberId);
    draft.worlds = draft.worlds.filter((world) => world.memberId !== ref.memberId);
  });
  ctx.hub.close(ref, NORMAL_CLOSE);
  ctx.uploads.forgetMember(ref);
  await pruneFiles(ctx.deps.store, lobby);
  ctx.publish(lobby);
};

export { leaveLobby };
