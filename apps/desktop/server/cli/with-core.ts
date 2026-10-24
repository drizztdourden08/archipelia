/* @layer server @kind logic */
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { startCore } from '@archipelia/server';
import type { Core, CoreDomains } from '@archipelia/server';
import { createNodeDomains, createNodeRest } from '@archipelia/server/node';
import { jobLogger } from '../start/job-logger';
import type { CliContext } from './cli.type';

const withCore = async <T>({ dataDir, args, out, err }: CliContext, work: (core: Core) => Promise<T>): Promise<T> => {
  const host: ServerHost<CoreDomains> = {
    dataDir, args, log: (message, level) => (level === 'error' ? err(message) : out(message)), domains: createNodeDomains(dataDir),
  };
  const started = startCore(host, createNodeRest(host, { onJob: jobLogger(host.log) }));
  try {
    return await work(started.core);
  } finally {
    await started.stop();
  }
};

export { withCore };
