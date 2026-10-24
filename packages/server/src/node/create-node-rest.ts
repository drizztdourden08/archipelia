/* @layer core @kind logic */
import { createJobRegistry } from '@drizztdourden08/brock-core/jobs';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { createNodeSecretStore } from '@drizztdourden08/brock-secrets/node';
import type { CoreDomains } from '../core/core-ports.type';
import type { CoreRest } from '../start/start-core.type';
import { nodeLanHost } from './node-lan-host';
import type { NodeRestOptions } from './node-rest.type';

const ignore = () => undefined;

const createNodeRest = (host: ServerHost<CoreDomains>, options: NodeRestOptions = {}): CoreRest => ({
  job: createJobRegistry(options.onJob ?? ignore).start,
  emit: options.onEvent ?? ignore,
  secrets: createNodeSecretStore({ dataDir: host.dataDir, ...(options.env ? { env: options.env } : {}) }),
  network: { automation: options.automation ?? false, lanHost: options.lanHost ?? nodeLanHost },
  ...(options.environment ? { environment: options.environment } : {}),
});

export { createNodeRest };
