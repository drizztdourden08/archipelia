/* @layer core @kind logic */
import { checkClientVersion, createError } from '@archipelia/lobby-protocol';
import { hashToken, newToken } from '@archipelia/lobby-protocol/node';
import type { LobbyMember } from '@archipelia/model';
import { settleLobby } from '../checks/settle-lobby';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef, Outcome } from '../lobby-service.type';
import { MEMBER_ID_PREFIX } from '../lobby.constants';
import { needOf } from '../state/need-of';
import { welcomeOf } from '../state/welcome-of';
import { admitSlots } from './admit-slots';
import { applySlots } from './apply-slots';
import { checkTrust } from './check-trust';
import { clientMeta } from './client-meta';
import { greetMember } from './greet-member';
import type { JoinRequest } from './join-lobby.type';

const addMember = async (ctx: LobbyContext, { lobby, hello, link }: JoinRequest): Promise<Outcome<MemberRef>> => {
  const failure = checkClientVersion(lobby.engine.ap, hello);
  if (failure) return { ok: false, failure };
  const trust = await checkTrust(hello, lobby, ctx.deps.trust, ctx.now());
  if (!trust.ok) return trust;
  const admitted = admitSlots(lobby, '', { slots: hello.slots, worlds: hello.worlds, trust: trust.value });
  if (!admitted.ok) return admitted;
  const token = newToken();
  const tokenHash = hashToken(token);
  const saved = await ctx.book.commit(lobby.id, (draft) => {
    const member: LobbyMember = {
      id: `${MEMBER_ID_PREFIX}${draft.nextMember}`, kind: 'client', displayName: hello.player.displayName, client: clientMeta(hello), tokenHash,
      admission: draft.options.admission === 'open' ? 'approved' : 'pending', trust: trust.value.level, ready: false, slots: [],
      joinedAt: ctx.now(), lastSeenAt: ctx.now(),
    };
    draft.nextMember += 1;
    draft.members.push(member);
    applySlots(draft, member.id, admitted.value);
  });
  const member = saved.members.find((candidate) => candidate.tokenHash === tokenHash);
  if (!member) throw new Error('the new member was not saved');
  const ref = { lobbyId: saved.id, memberId: member.id };
  const welcome = welcomeOf({ lobby: saved, member, token, need: await needOf(ctx.deps.store, saved, member), re: hello.seq, resumed: false, serverVersion: ctx.deps.serverVersion });
  const notices = admitted.value.notices.map((notice) => createError(notice, { re: hello.seq, welcomed: true }));
  await greetMember(ctx, ref, link, [welcome, ...notices]);
  await settleLobby(ctx, saved.id);
  return { ok: true, value: ref };
};

export { addMember };
