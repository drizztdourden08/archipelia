/* @layer core @kind logic */
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { createCore } from '../core/create-core';
import type { CoreDomains } from '../core/core-ports.type';
import { createListenerSlot } from './create-listener-slot';
import type { CoreRest, StartedCore } from './start-core.type';
import { startLobbyListener } from './start-lobby-listener';

const startCore = (host: ServerHost<CoreDomains>, rest: CoreRest): StartedCore => {
  const { domains } = host;
  if (!domains) throw new Error('the core needs the data domains of its host');
  const core = createCore({ ...rest, domain: domains.domain, log: host.log });
  const version = rest.environment?.version;
  const slot = createListenerSlot((options) =>
    startLobbyListener({ core, network: rest.network, log: host.log, domain: domains.domain }, { ...(version ? { serverVersion: version } : {}), ...options }));
  const stop = async () => {
    await slot.stop();
    await core.dispose();
  };
  return { core, listen: slot.listen, stop };
};

export { startCore };
