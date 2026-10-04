/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { openGgRooms } from '../gg/open-gg-rooms';

const ggHandlers: HandlerGroup = {
  id: 'archipelia-gg',
  register: (ctx) => {
    const { secrets } = ctx.services;
    ctx.handle(APP_CHANNELS.ggOpenRooms, (_event, baseUrl) => openGgRooms(baseUrl, secrets));
  },
};

export { ggHandlers };
