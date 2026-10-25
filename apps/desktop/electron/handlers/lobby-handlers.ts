/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { probeLobby } from '../lobbies/join/probe-lobby';
import { saveLobbyServerEntry } from '../lobbies/save-lobby-server-entry';
import { testLobbyServer } from '../lobbies/test-lobby-server';

const lobbyHandlers: HandlerGroup = {
  id: 'archipelia-lobbies',
  register: (ctx) => {
    const { admins, lanBrowser, lobbyServer, lobbyServers, secrets } = ctx.services;
    ctx.handle(APP_CHANNELS.lobbyServerStatus, () => lobbyServer.status());
    ctx.handle(APP_CHANNELS.lobbyServerApply, (_event, options) => lobbyServer.apply(options));
    ctx.handle(APP_CHANNELS.lobbyServerView, async (_event, serverId) => (await admins.opsFor(serverId)).view());
    ctx.handle(APP_CHANNELS.lobbyList, async (_event, serverId) => (await admins.opsFor(serverId)).list());
    ctx.handle(APP_CHANNELS.lobbyAct, async (_event, serverId, request) => (await admins.opsFor(serverId)).act(request));
    ctx.handle(APP_CHANNELS.lobbyServersList, () => lobbyServers.list());
    ctx.handle(APP_CHANNELS.lobbyServersSave, async (_event, entry) => {
      const saved = await saveLobbyServerEntry(lobbyServers, entry);
      admins.forget(saved.id);
      return saved;
    });
    ctx.handle(APP_CHANNELS.lobbyServersRemove, async (_event, id) => {
      admins.forget(id);
      await lobbyServers.remove(id);
    });
    ctx.handle(APP_CHANNELS.lobbyServersTest, (_event, id) => testLobbyServer(lobbyServers, secrets, id));
    ctx.handle(APP_CHANNELS.lanBrowse, (_event, on) => lanBrowser.browse(on));
    ctx.handle(APP_CHANNELS.lobbyProbe, (_event, address, code) => probeLobby(address, code));
  },
};

export { lobbyHandlers };
