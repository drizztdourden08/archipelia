/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainBootTasks } from '../.brock/boot.main';
import { mainModules } from '../.brock/modules.main';
import { product } from '../src/product';
import { DATA_DOMAINS } from './data-domains.constants';
import { servicesOf } from './services/services-of';
import { mainHandlers } from '../.brock/handlers.main';

bootstrapApp(product, {
  modules: mainModules,
  bootTasks: mainBootTasks,
  handlers: mainHandlers,
  dataDomains: DATA_DOMAINS,
  onWillQuit: (ctx) => { void servicesOf(ctx).sessions.stopLocal(); },
});
