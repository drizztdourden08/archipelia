/* @layer core @kind logic */
import { createError } from '@drizztdourden08/archipelia-lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import type { MemberRef, Outcome } from '../lobby-service.type';
import { needOf } from '../state/need-of';
import { welcomeOf } from '../state/welcome-of';
import { greetMember } from './greet-member';
import type { Welcoming } from './join-lobby.type';

const welcomeMember = async (ctx: LobbyContext, { lobby, member, token, hello, link, resumed, notices }: Welcoming): Promise<Outcome<MemberRef>> => {
  const ref = { lobbyId: lobby.id, memberId: member.id };
  const welcome = welcomeOf({ lobby, member, token, need: await needOf(ctx.deps.store, lobby, member), re: hello.seq, resumed, serverVersion: ctx.deps.serverVersion });
  await greetMember(ctx, ref, link, [welcome, ...notices.map((notice) => createError(notice, { re: hello.seq, welcomed: true }))]);
  return { ok: true, value: ref };
};

export { welcomeMember };
