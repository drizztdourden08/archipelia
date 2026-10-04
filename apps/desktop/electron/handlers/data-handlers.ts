/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { exportLibrary, importLibrary } from '@archipelia/sessions';
import { servicesOf } from '../services/services-of';

const dataHandlers: HandlerGroup = {
  id: 'archipelia-data',
  register: (ctx) => {
    const services = servicesOf(ctx);
    ctx.handle('ap:data:export', () => exportLibrary(services));
    ctx.handle('ap:data:import', (_event, bytes) => importLibrary(services, bytes));
  },
};

export { dataHandlers };
