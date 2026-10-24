/* @layer core @kind logic */
import { settleLobby } from '../checks/settle-lobby';
import { needsConsent } from '../checks/needs-consent';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';

const approveMember = async (ctx: LobbyContext, ref: MemberRef) => {
  const lobby = await ctx.book.commit(ref.lobbyId, (draft) => {
    const member = draft.members.find((candidate) => candidate.id === ref.memberId);
    if (member?.admission !== 'pending') throw new Error(`member ${ref.memberId} is not waiting for approval`);
    member.admission = 'approved';
    for (const slot of member.slots) if (slot.state === 'checking' && needsConsent(draft, member, slot)) slot.state = 'waiting-consent';
  });
  ctx.hub.send(ref, { type: 'admission', state: 'approved' });
  ctx.publish(lobby);
  await settleLobby(ctx, ref.lobbyId);
  return ctx.book.get(ref.lobbyId);
};

export { approveMember };
