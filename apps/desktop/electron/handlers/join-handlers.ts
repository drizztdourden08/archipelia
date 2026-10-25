/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const joinHandlers: HandlerGroup = {
  id: 'archipelia-joins',
  register: (ctx) => {
    const { joins } = ctx.services;
    ctx.handle(APP_CHANNELS.joinsList, () => joins.list());
    ctx.handle(APP_CHANNELS.joinsStart, (_event, request) => joins.request(request));
    ctx.handle(APP_CHANNELS.joinsResume, (_event, id) => joins.resume(id));
    ctx.handle(APP_CHANNELS.joinsLeave, (_event, id) => joins.leave(id));
    ctx.handle(APP_CHANNELS.joinsDismiss, (_event, id) => joins.dismiss(id));
  },
};

export { joinHandlers };
