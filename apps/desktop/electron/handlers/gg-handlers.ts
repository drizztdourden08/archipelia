/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { shell } from 'electron';
import { servicesOf } from '../services/services-of';
import { HTTPS } from './gg-handlers.constants';
import { GG_OWNER_SECRET } from '../../src/secrets/secret-names.constants';

const ggHandlers: HandlerGroup = {
  id: 'archipelia-gg',
  register: (ctx) => {
    const { secrets } = servicesOf(ctx);
    ctx.handle('ap:gg:openRooms', async (_event, baseUrl) => {
      if (!HTTPS.test(baseUrl)) throw new Error('the site address must start with https://');
      const ownerId = await secrets.get(GG_OWNER_SECRET);
      if (!ownerId) throw new Error('no archipelago.gg owner id is stored yet');
      await shell.openExternal(`${baseUrl.replace(/\/+$/, '')}/session/${ownerId}`);
    });
  },
};

export { ggHandlers };
