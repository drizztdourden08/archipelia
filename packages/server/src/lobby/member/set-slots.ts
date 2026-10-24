/* @layer core @kind logic */
import type { Failure, ServerMessage, SlotsSet } from '@drizztdourden08/archipelia-lobby-protocol';
import { createError } from '@drizztdourden08/archipelia-lobby-protocol';
import { admitInDraft } from '../join/admit-in-draft';
import type { Admitted } from '../join/admit-slots.type';
import { assessClient } from '../join/assess-client';
import { checkTrust } from '../join/check-trust';
import type { Assessed } from '../join/join-lobby.type';
import { SLOTS_FROZEN } from '../join/join.constants';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef } from '../lobby-service.type';
import { activeMember } from '../state/active-member';
import { needOf } from '../state/need-of';
import { rejectionOf } from '../state/rejection-of';
import { pruneFiles } from './prune-files';
import { slotRules } from './slot-rules';
import type { Replacing } from './set-slots.type';

const assessEarly = async (ctx: LobbyContext, ref: MemberRef, message: SlotsSet): Promise<Assessed | undefined> => {
  const client = activeMember(await ctx.book.get(ref.lobbyId), ref.memberId)?.client;
  return client ? assessClient({ client, worlds: message.worlds }, ctx.deps.trust, ctx.now()) : undefined;
};

const replaceSlots = async (ctx: LobbyContext, ref: MemberRef, message: SlotsSet, early: Assessed | undefined): Promise<ServerMessage[] | Failure> => {
  const lobby = await ctx.book.get(ref.lobbyId);
  const member = activeMember(lobby, ref.memberId);
  if (!lobby || !member?.client || lobby.phase !== 'open') return SLOTS_FROZEN;
  return admitReplacement(ctx, { lobby, member, client: member.client, early }, message);
};

const admitReplacement = async (ctx: LobbyContext, { lobby, member, client, early }: Replacing, message: SlotsSet): Promise<ServerMessage[] | Failure> => {
  const ref = { lobbyId: lobby.id, memberId: member.id };
  const rules = slotRules(client.capabilities, message);
  if (rules) return rules;
  const assessed = early?.clientId === client.id ? early : await assessClient({ client, worlds: message.worlds }, ctx.deps.trust, ctx.now());
  const trust = checkTrust(lobby, assessed);
  if (!trust.ok) return trust.failure;
  let admitted: Admitted | undefined;
  const saved = await ctx.book.commit(ref.lobbyId, (draft) => {
    admitted = admitInDraft(draft, member.id, { slots: message.slots, worlds: message.worlds, trust: trust.value });
  });
  const updated = saved.members.find((candidate) => candidate.id === member.id) ?? member;
  ctx.uploads.forgetMember(ref);
  await pruneFiles(ctx.deps.store, saved);
  ctx.publish(saved);
  const context = { re: message.seq, welcomed: true };
  const reply: ServerMessage = { type: 'slots.ok', need: await needOf(ctx.deps.store, saved, updated), ...(message.seq === undefined ? {} : { re: message.seq }) };
  return [reply, ...(admitted?.notices ?? []).map((notice) => createError(notice, context))];
};

const setSlots = async (ctx: LobbyContext, ref: MemberRef, message: SlotsSet): Promise<ServerMessage[]> => {
  const early = await assessEarly(ctx, ref, message);
  const result = await ctx.queue(`settle:${ref.lobbyId}`, () => replaceSlots(ctx, ref, message, early).catch((error: unknown) => {
    const failure = rejectionOf(error);
    if (failure) return failure;
    throw error;
  }));
  return Array.isArray(result) ? result : [createError(result, { re: message.seq, welcomed: true })];
};

export { setSlots };
