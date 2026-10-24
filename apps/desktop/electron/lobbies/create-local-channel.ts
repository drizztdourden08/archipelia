/* @layer electron-main @kind logic */
import type { AdminDeps } from '@archipelia/server';
import { adminHandlers, adminView } from '@archipelia/server';
import type { AdminChannel } from './lobbies.type';

const createLocalChannel = (deps: AdminDeps): AdminChannel => ({
  call: async (type, params = {}) => {
    const handler = adminHandlers[type];
    if (!handler) throw new Error(`The request ${type} is not known.`);
    return handler(deps, { ...params, type });
  },
  watch: (listener) =>
    deps.watch((lobby) => {
      const view = adminView(deps.sandbox, lobby);
      if (view) listener(view);
    }),
  close: () => undefined,
  alive: () => true,
});

export { createLocalChannel };
