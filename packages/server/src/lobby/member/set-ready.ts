/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';

const setReady = async (ctx: LobbyContext, ref: MemberRef, ready: boolean) => {
  const lobby = await ctx.book.commit(ref.lobbyId, (draft) => {
    const member = draft.members.find((candidate) => candidate.id === ref.memberId);
    if (member?.admission === 'pending' || member?.admission === 'approved') member.ready = ready;
  });
  ctx.publish(lobby);
};

export { setReady };
