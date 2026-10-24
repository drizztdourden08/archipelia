/* @layer electron-main @kind logic */
import type { AdminLobby, EngineOverview, SessionEngine } from '@archipelia/model';
import type { LobbyRequest, LobbyServerView, ServerInfo } from '../../src/lobbies/lobbies.type';
import { LOBBY_REQUESTS } from '../../src/lobbies/lobbies.constants';
import type { AdminChannel } from './lobbies.type';

const engineOf = (overview: EngineOverview): SessionEngine | undefined =>
  overview.active ? { id: overview.active.id, ap: overview.active.ap, python: overview.active.python } : undefined;

const createLobbyOps = (channel: AdminChannel) => ({
  list: async (): Promise<AdminLobby[]> => (await channel.call('lobby.list')) as AdminLobby[],
  act: async ({ type, params }: LobbyRequest): Promise<AdminLobby> => {
    if (!LOBBY_REQUESTS.includes(type)) throw new Error(`The request ${String(type)} is not a lobby request.`);
    return (await channel.call(type, params)) as AdminLobby;
  },
  view: async (): Promise<LobbyServerView> => {
    const info = (await channel.call('server.info')) as ServerInfo;
    const engine = engineOf((await channel.call('engine.list')) as EngineOverview);
    return engine ? { info, engine } : { info };
  },
});

export { createLobbyOps };
