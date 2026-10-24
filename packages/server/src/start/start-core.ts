/* @layer core @kind logic */
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { createCore } from '../core/create-core';
import type { CoreDomains } from '../core/core-ports.type';
import type { CoreRest, StartedCore } from './start-core.type';

const startCore = (host: ServerHost<CoreDomains>, rest: CoreRest): StartedCore => {
  const { domains } = host;
  if (!domains) throw new Error('the core needs the data domains of its host');
  const core = createCore({ ...rest, domain: domains.domain, log: host.log });
  return { core, stop: core.dispose };
};

export { startCore };
