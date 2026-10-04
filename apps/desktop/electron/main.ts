/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainBootTasks } from '../.brock/boot.main';
import { mainModules } from '../.brock/modules.main';
import { mainHandlers } from '../.brock/handlers.main';
import { product } from '../src/product';
import { DATA_DOMAINS } from './data-domains.constants';
import { createAppServices } from './services/app-services';

bootstrapApp(product, {
  modules: mainModules,
  bootTasks: mainBootTasks,
  handlers: mainHandlers,
  services: createAppServices,
  dataDomains: DATA_DOMAINS,
});
