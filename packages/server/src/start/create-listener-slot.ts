/* @layer core @kind logic */
import type { LobbyEndpoint, LobbyListen } from './start-core.type';

const createListenerSlot = (open: (options: LobbyListen) => Promise<LobbyEndpoint>) => {
  let current: Promise<LobbyEndpoint> | undefined;

  const listen = (options: LobbyListen = {}): Promise<LobbyEndpoint> => {
    if (current) return current;
    const forget = (): void => {
      if (current === opened) current = undefined;
    };
    const opened: Promise<LobbyEndpoint> = open(options).then(
      (endpoint) => ({
        ...endpoint,
        stop: async () => {
          forget();
          await endpoint.stop();
        },
      }),
      (error: unknown) => {
        forget();
        throw error;
      },
    );
    current = opened;
    return opened;
  };

  const stop = async (): Promise<void> => {
    const running = current;
    current = undefined;
    await running?.then((endpoint) => endpoint.stop(), () => undefined);
  };

  return { listen, stop };
};

export { createListenerSlot };
