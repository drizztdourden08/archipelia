/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainModules } from '../.brock/modules.main';
import { product } from '../src/product';
import { DATA_DOMAINS } from './data-domains.constants';
import { dataHandlers } from './handlers/data-handlers';
import { engineHandlers } from './handlers/engine-handlers';
import { gamesHandlers } from './handlers/games-handlers';
import { ggHandlers } from './handlers/gg-handlers';
import { libraryHandlers } from './handlers/library-handlers';
import { serverHandlers } from './handlers/server-handlers';
import { sessionHandlers } from './handlers/session-handlers';
import { servicesOf } from './services/services-of';

bootstrapApp(product, {
  modules: mainModules,
  handlers: [dataHandlers, engineHandlers, gamesHandlers, ggHandlers, libraryHandlers, serverHandlers, sessionHandlers],
  dataDomains: DATA_DOMAINS,
  onWillQuit: (ctx) => { void servicesOf(ctx).sessions.stopLocal(); },
});
