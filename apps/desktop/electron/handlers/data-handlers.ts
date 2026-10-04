/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { exportLibrary, importLibrary } from '@archipelia/sessions';

const dataHandlers: HandlerGroup = {
  id: 'archipelia-data',
  register: (ctx) => {
    const { services } = ctx;
    ctx.handle(APP_CHANNELS.dataExport, () => exportLibrary(services));
    ctx.handle(APP_CHANNELS.dataImport, (_event, bytes) => importLibrary(services, bytes));
  },
};

export { dataHandlers };
