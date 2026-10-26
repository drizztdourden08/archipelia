/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { wireInstallFailure } from '@archipelia/model';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const gamesHandlers: HandlerGroup = {
  id: 'archipelia-games',
  register: (ctx) => {
    const { catalog, installed } = ctx.services;
    const wired = <T,>(work: Promise<T>) => work.catch((err: unknown) => { throw wireInstallFailure(err); });
    ctx.handle(APP_CHANNELS.catalogRead, (_event, refresh) => catalog.read(refresh));
    ctx.handle(APP_CHANNELS.catalogOfficial, () => catalog.official());
    ctx.handle(APP_CHANNELS.catalogEnrich, (_event, request) => catalog.enrich(request));
    ctx.handle(APP_CHANNELS.gamesList, () => installed());
    ctx.handle(APP_CHANNELS.gamesInstall, (_event, request) => wired(catalog.install(request)));
    ctx.handle(APP_CHANNELS.gamesPackages, (_event, request) => wired(catalog.packages(request)));
    ctx.handle(APP_CHANNELS.gamesRemove, (_event, apworld) => catalog.remove(apworld));
  },
};

export { gamesHandlers };
