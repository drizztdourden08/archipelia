/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { exportData } from '../services/export-data';
import { importData } from '../services/import-data';
import { servicesOf } from '../services/services-of';

const dataHandlers: HandlerGroup = {
  id: 'archipelia-data',
  register: (ctx) => {
    const services = servicesOf(ctx);
    ctx.handle('ap:data:export', () => exportData(services));
    ctx.handle('ap:data:import', (_event, bytes) => importData(services, bytes));
  },
};

export { dataHandlers };
