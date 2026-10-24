/* @layer core @kind logic */
import { CLOSE_CODES } from '@archipelia/lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { dropFiles } from './drop-files';
import type { Dismissal } from './dismiss-member.type';

const dismissMember = async (ctx: LobbyContext, ref: MemberRef, { admission, reason, message }: Dismissal) => {
  const lobby = await ctx.book.commit(ref.lobbyId, (draft) => {
    const member = draft.members.find((candidate) => candidate.id === ref.memberId);
    if (!member) return;
    member.admission = admission;
    member.ready = false;
    if (reason !== undefined) member.reason = reason;
  });
  ctx.hub.send(ref, message);
  ctx.hub.close(ref, CLOSE_CODES.forbidden);
  await dropFiles(ctx.deps.store, lobby, ref.memberId);
  ctx.publish(lobby);
  return lobby;
};

export { dismissMember };
