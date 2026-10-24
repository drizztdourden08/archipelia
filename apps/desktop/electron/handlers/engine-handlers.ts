/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const engineHandlers: HandlerGroup = {
  id: 'archipelia-engine',
  register: (ctx) => {
    const { engine } = ctx.services;
    ctx.handle(APP_CHANNELS.engineStatus, () => engine.status());
    ctx.handle(APP_CHANNELS.engineSetup, () => engine.setup());
    ctx.handle(APP_CHANNELS.engineOverview, (_event, force) => engine.overview(force === true));
    ctx.handle(APP_CHANNELS.engineInstall, (_event, choice) => engine.install(choice));
    ctx.handle(APP_CHANNELS.engineSwitch, (_event, id) => engine.switchTo(id));
    ctx.handle(APP_CHANNELS.engineRemove, (_event, id) => engine.remove(id));
    ctx.handle(APP_CHANNELS.engineStartup, () => engine.startup());
    ctx.handle(APP_CHANNELS.engineOfferShown, (_event, version) => engine.offerShown(version));
  },
};

export { engineHandlers };
