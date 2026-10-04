/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { testSavedServer } from '@archipelia/hosts';

const serverHandlers: HandlerGroup = {
  id: 'archipelia-servers',
  register: (ctx) => {
    const { secrets, servers } = ctx.services;
    ctx.handle('ap:servers:list', () => servers.list());
    ctx.handle('ap:servers:save', (_event, entry) => servers.save(entry));
    ctx.handle('ap:servers:remove', (_event, id) => servers.remove(id));
    ctx.handle('ap:servers:test', async (_event, id) => testSavedServer(await servers.require(id), secrets, servers));
    ctx.handle('ap:servers:trustKey', async (_event, id, sha256) => servers.save({ ...(await servers.require(id)), hostKeySha256: sha256 }));
  },
};

export { serverHandlers };
