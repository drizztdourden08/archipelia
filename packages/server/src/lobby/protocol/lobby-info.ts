/* @layer core @kind logic */
import type { LobbyInfoReply, LobbyInfoRequest } from '@archipelia/lobby-protocol';
import { lobbyNotFoundFailure, negotiateProtocol, normalizeLobbyCode } from '@archipelia/lobby-protocol';
import { LOBBY_CLOSED } from '../join/join.constants';
import type { LobbyContext } from '../lobby-context.type';
import type { Outcome } from '../lobby-service.type';
import { infoReply } from '../state/info-reply';

const lobbyInfo = async (ctx: LobbyContext, request: LobbyInfoRequest): Promise<Outcome<LobbyInfoReply>> => {
  const negotiated = negotiateProtocol(request.protocol.versions);
  if (!negotiated.ok) return negotiated;
  const code = normalizeLobbyCode(request.lobby.code);
  const lobby = code === null ? undefined : await ctx.book.byCode(code);
  if (!lobby) return { ok: false, failure: lobbyNotFoundFailure() };
  if (lobby.phase === 'closed') return { ok: false, failure: LOBBY_CLOSED };
  const reply = infoReply(lobby, ctx.deps.serverVersion);
  return { ok: true, value: request.seq === undefined ? reply : { ...reply, re: request.seq } };
};

export { lobbyInfo };
