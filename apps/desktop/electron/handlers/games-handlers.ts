/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { servicesOf } from '../services/services-of';

const gamesHandlers: HandlerGroup = {
  id: 'archipelia-games',
  register: (ctx) => {
    const { catalog, installed } = servicesOf(ctx);
    ctx.handle('ap:catalog:read', (_event, refresh) => catalog.read(refresh));
    ctx.handle('ap:catalog:official', () => catalog.official());
    ctx.handle('ap:games:list', () => installed());
    ctx.handle('ap:games:install', (_event, request) => catalog.install(request));
    ctx.handle('ap:games:remove', (_event, apworld) => catalog.remove(apworld));
  },
};

export { gamesHandlers };
