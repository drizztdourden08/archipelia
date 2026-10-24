/* @layer core @kind logic */
import { checkClientVersion } from '@archipelia/lobby-protocol';
import { hashToken, newToken } from '@archipelia/lobby-protocol/node';
import type { Hello } from '@archipelia/lobby-protocol';
import type { Lobby, LobbyMember, UploadTrust } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef, Outcome } from '../lobby-service.type';
import { MEMBER_ID_PREFIX } from '../lobby.constants';
import { rejected } from '../state/rejected';
import type { Admitted } from './admit-slots.type';
import { admitInDraft } from './admit-in-draft';
import { checkTrust } from './check-trust';
import { clientMeta } from './client-meta';
import { welcomeMember } from './welcome-member';
import { LOBBY_LOCKED } from './join.constants';
import type { JoinRequest } from './join-lobby.type';

const enter = (ctx: LobbyContext, draft: Lobby, hello: Hello, joined: { tokenHash: string; trust: UploadTrust }): Admitted => {
  if (draft.phase !== 'open') throw rejected(LOBBY_LOCKED);
  const member: LobbyMember = {
    id: `${MEMBER_ID_PREFIX}${draft.nextMember}`, kind: 'client', displayName: hello.player.displayName, client: clientMeta(hello), tokenHash: joined.tokenHash,
    admission: draft.options.admission === 'open' ? 'approved' : 'pending', trust: joined.trust.level, ready: false, slots: [],
    joinedAt: ctx.now(), lastSeenAt: ctx.now(),
  };
  draft.nextMember += 1;
  draft.members.push(member);
  return admitInDraft(draft, member.id, { slots: hello.slots, worlds: hello.worlds, trust: joined.trust });
};

const addMember = async (ctx: LobbyContext, { lobby, hello, link }: JoinRequest): Promise<Outcome<MemberRef>> => {
  const failure = checkClientVersion(lobby.engine.ap, hello);
  if (failure) return { ok: false, failure };
  const trust = await checkTrust(hello, lobby, ctx.deps.trust, ctx.now());
  if (!trust.ok) return trust;
  const token = newToken();
  const tokenHash = hashToken(token);
  let notices: Admitted['notices'] = [];
  const saved = await ctx.book.commit(lobby.id, (draft) => {
    notices = enter(ctx, draft, hello, { tokenHash, trust: trust.value }).notices;
  });
  const member = saved.members.find((candidate) => candidate.tokenHash === tokenHash);
  if (!member) throw new Error('the new member was not saved');
  return welcomeMember(ctx, { lobby: saved, member, token, hello, link, resumed: false, notices });
};

export { addMember };
