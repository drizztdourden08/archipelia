/* @layer electron-main @kind logic */
import { DOMAIN } from '@archipelia/model';
import { createAdminRegistry } from './create-admin-registry';
import { createLanBrowser } from './create-lan-browser';
import { createLobbyServer } from './create-lobby-server';
import { createLobbyServerStore } from './create-lobby-server-store';
import { createLocalChannel } from './create-local-channel';
import type { LobbyServicesDeps } from './lobbies.type';

const createLobbyServices = async (deps: LobbyServicesDeps) => {
  const { core, domain, automation, log } = deps;
  const lobbyServer = createLobbyServer({ listen: deps.listen, files: domain(DOMAIN.server), automation, canStoreSecrets: deps.canStoreSecrets, lanHost: deps.lanHost, version: deps.version, log });
  const local = createLocalChannel({ service: core.lobbies, token: core.adminToken, watch: core.watchLobbies, sandbox: (await core.sandbox()).mode, info: lobbyServer.info, engines: () => core.engine.overview() });
  const lobbyServers = createLobbyServerStore(domain(DOMAIN.lobbyServers));
  const admins = createAdminRegistry({ local, store: lobbyServers, secrets: deps.secrets, onLobby: deps.onLobby });
  const lanBrowser = createLanBrowser({ automation, selfId: () => lobbyServer.status().serverId, onChange: deps.onLan, log });
  void lobbyServer.start().catch((error: unknown) => log(`the lobby server did not start: ${String(error)}`));
  return { admins, lanBrowser, lobbyServer, lobbyServers };
};

export { createLobbyServices };
