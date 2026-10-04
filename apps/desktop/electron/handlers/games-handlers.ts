/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const gamesHandlers: HandlerGroup = {
  id: 'archipelia-games',
  register: (ctx) => {
    const { catalog, installed } = ctx.services;
    ctx.handle(APP_CHANNELS.catalogRead, (_event, refresh) => catalog.read(refresh));
    ctx.handle(APP_CHANNELS.catalogOfficial, () => catalog.official());
    ctx.handle(APP_CHANNELS.gamesList, () => installed());
    ctx.handle(APP_CHANNELS.gamesInstall, (_event, request) => catalog.install(request));
    ctx.handle(APP_CHANNELS.gamesRemove, (_event, apworld) => catalog.remove(apworld));
  },
};

export { gamesHandlers };
