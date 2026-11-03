/* @layer core @kind logic */
import type { LobbyInfoReply, LobbyInfoRequest } from '@drizztdourden08/archipelia-lobby-protocol';
import { negotiateProtocol } from '@drizztdourden08/archipelia-lobby-protocol';
import { findLobby } from '../join/find-lobby';
import { LOBBY_CLOSED } from '../join/join.constants';
import type { LobbyContext } from '../lobby-context.type';
import type { Outcome } from '../lobby-service.type';
import { infoReply } from '../state/info-reply';

const lobbyInfo = async (ctx: LobbyContext, request: LobbyInfoRequest): Promise<Outcome<LobbyInfoReply>> => {
  const negotiated = negotiateProtocol(request.protocol.versions);
  if (!negotiated.ok) return negotiated;
  const found = await findLobby(ctx.book, request.lobby);
  if (!found.ok) return found;
  const lobby = found.value;
  if (lobby.phase === 'closed') return { ok: false, failure: LOBBY_CLOSED };
  const reply = infoReply(lobby, ctx.deps.serverVersion);
  return { ok: true, value: request.seq === undefined ? reply : { ...reply, re: request.seq } };
};

export { lobbyInfo };
