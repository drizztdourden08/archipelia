/* @layer core @kind logic */
import type { Hello } from '@drizztdourden08/archipelia-lobby-protocol';
import { checkHello, lobbyNotFoundFailure, negotiateProtocol, normalizeLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { settleLobby } from '../checks/settle-lobby';
import type { LobbyContext } from '../lobby-context.type';
import type { LobbyLink, MemberRef, Outcome } from '../lobby-service.type';
import { rejectionOf } from '../state/rejection-of';
import { addMember } from './add-member';
import { checkAccess } from './check-access';
import { resumeMember } from './resume-member';

const enter = async (ctx: LobbyContext, run: () => Promise<Outcome<MemberRef>>): Promise<Outcome<MemberRef>> => {
  try {
    return await run();
  } catch (error) {
    const failure = rejectionOf(error);
    if (failure) return { ok: false, failure };
    throw error;
  }
};

const joinLobby = async (ctx: LobbyContext, hello: Hello, link: LobbyLink): Promise<Outcome<MemberRef>> => {
  const negotiated = negotiateProtocol(hello.protocol.versions);
  if (!negotiated.ok) return negotiated;
  const code = normalizeLobbyCode(hello.lobby.code);
  const lobby = code === null ? undefined : await ctx.book.byCode(code);
  if (!lobby) return { ok: false, failure: lobbyNotFoundFailure() };
  const failure = checkAccess(lobby, hello) ?? checkHello(hello);
  if (failure) return { ok: false, failure };
  const join = async () => {
    const current = (await ctx.book.get(lobby.id)) ?? lobby;
    return hello.resume ? resumeMember(ctx, { lobby: current, hello, link, token: hello.resume }) : addMember(ctx, { lobby: current, hello, link });
  };
  const result = await ctx.queue(`settle:${lobby.id}`, () => enter(ctx, join));
  if (result.ok) await settleLobby(ctx, lobby.id);
  return result;
};

export { joinLobby };
