/* @layer core @kind logic */
import type { LobbyBrowseReply, LobbyBrowseRequest } from '@drizztdourden08/archipelia-lobby-protocol';
import { LOBBY_BROWSE_MAX, PROTOCOL_NAME, PROTOCOL_VERSION, negotiateProtocol } from '@drizztdourden08/archipelia-lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import type { Outcome } from '../lobby-service.type';
import { SERVER_NAME } from '../lobby.constants';
import { browsedLobby } from '../state/browsed-lobby';

const lobbyBrowse = async (ctx: LobbyContext, request: LobbyBrowseRequest): Promise<Outcome<LobbyBrowseReply>> => {
  const negotiated = negotiateProtocol(request.protocol.versions);
  if (!negotiated.ok) return negotiated;
  const lobbies = (await ctx.book.list())
    .filter((lobby) => lobby.options.listed === true && lobby.phase === 'open')
    .sort((a, b) => a.createdAt - b.createdAt)
    .flatMap((lobby) => (lobby.joinToken === undefined ? [] : [browsedLobby(lobby, lobby.joinToken)]))
    .slice(0, LOBBY_BROWSE_MAX);
  const reply: LobbyBrowseReply = {
    type: 'lobby.browse.reply',
    protocol: { name: PROTOCOL_NAME, version: PROTOCOL_VERSION },
    server: { name: SERVER_NAME, version: ctx.deps.serverVersion },
    lobbies,
  };
  return { ok: true, value: request.seq === undefined ? reply : { ...reply, re: request.seq } };
};

export { lobbyBrowse };
