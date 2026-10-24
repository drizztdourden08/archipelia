/* @layer core @kind logic */
import type { ServerMessage, SlotsSet } from '@archipelia/lobby-protocol';
import { createError } from '@archipelia/lobby-protocol';
import { settleLobby } from '../checks/settle-lobby';
import { admitSlots } from '../join/admit-slots';
import { applySlots } from '../join/apply-slots';
import { checkTrust } from '../join/check-trust';
import { SLOTS_FROZEN } from '../join/join.constants';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { needOf } from '../state/need-of';

const setSlots = async (ctx: LobbyContext, ref: MemberRef, message: SlotsSet): Promise<ServerMessage[]> => {
  const context = { re: message.seq, welcomed: true };
  const lobby = await ctx.book.get(ref.lobbyId);
  const member = lobby?.members.find((candidate) => candidate.id === ref.memberId);
  if (!lobby || !member?.client) return [createError(SLOTS_FROZEN, context)];
  if (lobby.phase !== 'open') return [createError(SLOTS_FROZEN, context)];
  const trust = await checkTrust({ client: member.client, worlds: message.worlds }, lobby, ctx.deps.trust, ctx.now());
  if (!trust.ok) return [createError(trust.failure, context)];
  const admitted = admitSlots(lobby, member.id, { slots: message.slots, worlds: message.worlds, trust: trust.value });
  if (!admitted.ok) return [createError(admitted.failure, context)];
  const saved = await ctx.book.commit(ref.lobbyId, (draft) => applySlots(draft, member.id, admitted.value));
  const updated = saved.members.find((candidate) => candidate.id === member.id) ?? member;
  ctx.publish(saved);
  void settleLobby(ctx, ref.lobbyId);
  const reply: ServerMessage = { type: 'slots.ok', need: await needOf(ctx.deps.store, saved, updated), ...(message.seq === undefined ? {} : { re: message.seq }) };
  return [reply, ...admitted.value.notices.map((notice) => createError(notice, context))];
};

export { setSlots };
