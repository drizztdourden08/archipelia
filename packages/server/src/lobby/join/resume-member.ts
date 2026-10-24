/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import { checkClientVersion, createError, resumeOutcome } from '@archipelia/lobby-protocol';
import { hashToken } from '@archipelia/lobby-protocol/node';
import type { Lobby, LobbyMember } from '@archipelia/model';
import { settleLobby } from '../checks/settle-lobby';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef, Outcome } from '../lobby-service.type';
import { needOf } from '../state/need-of';
import { welcomeOf } from '../state/welcome-of';
import { admitSlots } from './admit-slots';
import type { Admitted } from './admit-slots.type';
import { applySlots } from './apply-slots';
import { checkTrust } from './check-trust';
import { clientMeta } from './client-meta';
import { greetMember } from './greet-member';
import { SLOTS_FROZEN } from './join.constants';
import type { ResumeRequest } from './join-lobby.type';
import { slotsKey } from './slots-key';

const changed = (lobby: Lobby, member: LobbyMember, { hello }: ResumeRequest) => {
  const stored = slotsKey(member.slots.map((slot) => ({ ...slot, yaml: slot.yamlSha256 })), lobby.worlds.filter((world) => world.memberId === member.id).map((world) => world.sha256));
  return stored !== slotsKey(hello.slots.map((slot) => ({ ...slot, yaml: slot.yaml.sha256 })), hello.worlds.map((world) => world.sha256));
};

const resumeChecks = async (ctx: LobbyContext, request: ResumeRequest): Promise<Outcome<LobbyMember>> => {
  const { lobby, hello, token } = request;
  const member = lobby.members.find((candidate) => candidate.tokenHash === hashToken(token)) ?? null;
  const outcome = resumeOutcome(member);
  if (outcome.kind === 'error' || !member) return { ok: false, failure: outcome.kind === 'error' ? outcome.failure : { code: 'resume-invalid', message: 'This lobby does not know this player.' } };
  const failure = checkClientVersion(lobby.engine.ap, hello);
  if (failure) return { ok: false, failure };
  const trust = await checkTrust(hello, lobby, ctx.deps.trust, ctx.now());
  return trust.ok ? { ok: true, value: member } : trust;
};

const newSlots = async (ctx: LobbyContext, request: ResumeRequest, member: LobbyMember): Promise<Outcome<Admitted | null>> => {
  const { lobby, hello } = request;
  if (lobby.phase !== 'open' || !changed(lobby, member, request)) return { ok: true, value: null };
  const trust = await checkTrust(hello, lobby, ctx.deps.trust, ctx.now());
  if (!trust.ok) return trust;
  return admitSlots(lobby, member.id, { slots: hello.slots, worlds: hello.worlds, trust: trust.value });
};

const resumeMember = async (ctx: LobbyContext, request: ResumeRequest): Promise<Outcome<MemberRef>> => {
  const { lobby, hello, link, token } = request;
  const checked = await resumeChecks(ctx, request);
  if (!checked.ok) return checked;
  const found = checked.value;
  const admitted = await newSlots(ctx, request, found);
  if (!admitted.ok) return admitted;
  const saved = await ctx.book.commit(lobby.id, (draft) => {
    const member = draft.members.find((candidate) => candidate.id === found.id);
    if (member) Object.assign(member, { lastSeenAt: ctx.now(), client: clientMeta(hello), displayName: hello.player.displayName });
    if (admitted.value) applySlots(draft, found.id, admitted.value);
  });
  const member = saved.members.find((candidate) => candidate.id === found.id) ?? found;
  const frozen: Failure[] = lobby.phase !== 'open' && changed(lobby, found, request) ? [SLOTS_FROZEN] : [];
  const notices = [...(admitted.value?.notices ?? []), ...frozen].map((notice) => createError(notice, { re: hello.seq, welcomed: true }));
  const welcome = welcomeOf({ lobby: saved, member, token, need: await needOf(ctx.deps.store, saved, member), re: hello.seq, resumed: true, serverVersion: ctx.deps.serverVersion });
  const ref = { lobbyId: saved.id, memberId: member.id };
  await greetMember(ctx, ref, link, [welcome, ...notices]);
  await settleLobby(ctx, saved.id);
  return { ok: true, value: ref };
};

export { resumeMember };
