/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import { checkClientVersion, resumeOutcome } from '@archipelia/lobby-protocol';
import { hashToken } from '@archipelia/lobby-protocol/node';
import type { Lobby, LobbyMember, UploadTrust } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef, Outcome } from '../lobby-service.type';
import { admitInDraft } from './admit-in-draft';
import { checkTrust } from './check-trust';
import { clientMeta } from './client-meta';
import { pruneFiles } from '../member/prune-files';
import { welcomeMember } from './welcome-member';
import { SLOTS_FROZEN } from './join.constants';
import type { ResumeRequest } from './join-lobby.type';
import { slotsKey } from './slots-key';

const changed = (lobby: Lobby, member: LobbyMember, { hello }: ResumeRequest) => {
  const stored = slotsKey(member.slots.map((slot) => ({ ...slot, yaml: slot.yamlSha256 })), lobby.worlds.filter((world) => world.memberId === member.id).map((world) => world.sha256));
  return stored !== slotsKey(hello.slots.map((slot) => ({ ...slot, yaml: slot.yaml.sha256 })), hello.worlds.map((world) => world.sha256));
};

const resumeChecks = async (ctx: LobbyContext, request: ResumeRequest): Promise<Outcome<{ member: LobbyMember; trust: UploadTrust }>> => {
  const { lobby, hello, token } = request;
  const member = lobby.members.find((candidate) => candidate.tokenHash === hashToken(token)) ?? null;
  const outcome = resumeOutcome(member);
  if (outcome.kind === 'error' || !member) return { ok: false, failure: outcome.kind === 'error' ? outcome.failure : { code: 'resume-invalid', message: 'This lobby does not know this player.' } };
  const failure = checkClientVersion(lobby.engine.ap, hello);
  if (failure) return { ok: false, failure };
  const trust = await checkTrust(hello, lobby, ctx.deps.trust, ctx.now());
  return trust.ok ? { ok: true, value: { member, trust: trust.value } } : trust;
};

const resumeMember = async (ctx: LobbyContext, request: ResumeRequest): Promise<Outcome<MemberRef>> => {
  const { lobby, hello, link, token } = request;
  const checked = await resumeChecks(ctx, request);
  if (!checked.ok) return checked;
  const found = checked.value.member;
  const replace = changed(lobby, found, request);
  const notices: Failure[] = replace && lobby.phase !== 'open' ? [SLOTS_FROZEN] : [];
  const saved = await ctx.book.commit(lobby.id, (draft) => {
    const member = draft.members.find((candidate) => candidate.id === found.id);
    if (member) Object.assign(member, { lastSeenAt: ctx.now(), client: clientMeta(hello), displayName: hello.player.displayName });
    if (replace && draft.phase === 'open') notices.push(...admitInDraft(draft, found.id, { slots: hello.slots, worlds: hello.worlds, trust: checked.value.trust }).notices);
  });
  const member = saved.members.find((candidate) => candidate.id === found.id) ?? found;
  if (replace && lobby.phase === 'open') {
    ctx.uploads.forgetMember({ lobbyId: saved.id, memberId: found.id });
    await pruneFiles(ctx.deps.store, saved);
  }
  return welcomeMember(ctx, { lobby: saved, member, token, hello, link, resumed: true, notices });
};

export { resumeMember };
