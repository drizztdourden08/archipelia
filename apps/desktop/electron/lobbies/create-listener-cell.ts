/* @layer electron-main @kind logic */
import type { LobbyEndpoint } from '@archipelia/server';
import type { LobbyServerState } from '../../src/lobbies/lobbies.type';
import type { LobbyServerDeps, ListenerCell } from './lobbies.type';

const createListenerCell = ({ listen, automation, log }: Pick<LobbyServerDeps, 'listen' | 'automation' | 'log'>): ListenerCell => {
  let endpoint: LobbyEndpoint | undefined;
  let failure: string | undefined;
  let tried = false;

  const open: ListenerCell['open'] = async (options) => {
    try {
      endpoint = await listen({ mode: options.mode, publicAddressLookup: options.publicLookup, ...(automation ? { port: 0 } : {}) });
      failure = undefined;
    } catch (error) {
      endpoint = undefined;
      failure = error instanceof Error ? error.message : String(error);
      log(`the lobby server did not start: ${failure}`);
    }
    tried = true;
  };

  const close = async () => {
    const running = endpoint;
    endpoint = undefined;
    await running?.stop();
  };

  const state = (): LobbyServerState => {
    if (endpoint) return 'listening';
    return tried ? 'failed' : 'starting';
  };

  return { open, close, state, endpoint: () => endpoint, failure: () => failure };
};

export { createListenerCell };
