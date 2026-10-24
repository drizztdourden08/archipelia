/* @layer core @kind logic */
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { createCore } from '../core/create-core';
import type { CoreDomains } from '../core/core-ports.type';
import type { CoreRest, LobbyEndpoint, LobbyListen, StartedCore } from './start-core.type';
import { startLobbyListener } from './start-lobby-listener';

const startCore = (host: ServerHost<CoreDomains>, rest: CoreRest): StartedCore => {
  const { domains } = host;
  if (!domains) throw new Error('the core needs the data domains of its host');
  const core = createCore({ ...rest, domain: domains.domain, log: host.log });
  let listener: Promise<LobbyEndpoint> | undefined;
  const listen = (options: LobbyListen = {}) => {
    const version = rest.environment?.version;
    listener ??= startLobbyListener({ core, network: rest.network, log: host.log, domain: domains.domain }, { ...(version ? { serverVersion: version } : {}), ...options });
    return listener;
  };
  const stop = async () => {
    const running = listener;
    listener = undefined;
    if (running) await (await running).stop();
    await core.dispose();
  };
  return { core, listen, stop };
};

export { startCore };
