/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { testSavedServer } from '@archipelia/hosts';

const serverHandlers: HandlerGroup = {
  id: 'archipelia-servers',
  register: (ctx) => {
    const { secrets, servers } = ctx.services;
    ctx.handle(APP_CHANNELS.serversList, () => servers.list());
    ctx.handle(APP_CHANNELS.serversSave, (_event, entry) => servers.save(entry));
    ctx.handle(APP_CHANNELS.serversRemove, (_event, id) => servers.remove(id));
    ctx.handle(APP_CHANNELS.serversTest, async (_event, id) => testSavedServer(await servers.require(id), secrets, servers));
    ctx.handle(APP_CHANNELS.serversTrustKey, async (_event, id, sha256) => servers.save({ ...(await servers.require(id)), hostKeySha256: sha256 }));
  },
};

export { serverHandlers };
