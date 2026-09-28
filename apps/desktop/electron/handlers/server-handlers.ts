/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { testServer } from '@archipelia/hosts';
import type { ServerEntry } from '@archipelia/model';
import type { ServerTestResult } from '../../src/ipc/contract.type';
import { credentialsOf } from '../services/server-credentials';
import { servicesOf } from '../services/services-of';

const serverHandlers: HandlerGroup = {
  id: 'archipelia-servers',
  register: (ctx) => {
    const { secrets, servers } = servicesOf(ctx);

    const runTest = async (entry: ServerEntry): Promise<ServerTestResult> => {
      let offered: string | undefined;
      const onHostKey = (sha: string) => { offered = sha; return false; };
      const result = await testServer(entry, await credentialsOf(entry, secrets), { onHostKey });
      await servers.save({ ...entry, lastTest: result });
      return offered && !entry.hostKeySha256 ? { ...result, hostKey: offered } : result;
    };

    ctx.handle('ap:servers:list', () => servers.list());
    ctx.handle('ap:servers:save', (_event, entry) => servers.save(entry));
    ctx.handle('ap:servers:remove', (_event, id) => servers.remove(id));
    ctx.handle('ap:servers:test', async (_event, id) => runTest(await servers.require(id)));
    ctx.handle('ap:servers:trustKey', async (_event, id, sha256) => servers.save({ ...(await servers.require(id)), hostKeySha256: sha256 }));
  },
};

export { serverHandlers };
