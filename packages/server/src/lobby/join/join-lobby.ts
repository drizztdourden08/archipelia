/* @layer core @kind logic */
import type { Hello } from '@archipelia/lobby-protocol';
import { checkHello, lobbyNotFoundFailure, negotiateProtocol, normalizeLobbyCode } from '@archipelia/lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import type { LobbyLink, MemberRef, Outcome } from '../lobby-service.type';
import { addMember } from './add-member';
import { checkAccess } from './check-access';
import { resumeMember } from './resume-member';

const joinLobby = async (ctx: LobbyContext, hello: Hello, link: LobbyLink): Promise<Outcome<MemberRef>> => {
  const negotiated = negotiateProtocol(hello.protocol.versions);
  if (!negotiated.ok) return negotiated;
  const code = normalizeLobbyCode(hello.lobby.code);
  const lobby = code === null ? undefined : await ctx.book.byCode(code);
  if (!lobby) return { ok: false, failure: lobbyNotFoundFailure() };
  const failure = checkAccess(lobby, hello) ?? checkHello(hello);
  if (failure) return { ok: false, failure };
  return hello.resume ? resumeMember(ctx, { lobby, hello, link, token: hello.resume }) : addMember(ctx, { lobby, hello, link });
};

export { joinLobby };
