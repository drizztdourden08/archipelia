/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { openGgRooms } from '../gg/open-gg-rooms';

const ggHandlers: HandlerGroup = {
  id: 'archipelia-gg',
  register: (ctx) => {
    const { secrets } = ctx.services;
    ctx.handle('ap:gg:openRooms', (_event, baseUrl) => openGgRooms(baseUrl, secrets));
  },
};

export { ggHandlers };
