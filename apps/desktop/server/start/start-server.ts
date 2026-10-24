/* @layer server @kind logic */
import type { RunningServer, ServerHost } from '@drizztdourden08/brock-electron/server';
import { DOMAIN } from '@archipelia/model';
import { startCore } from '@archipelia/server';
import type { CoreDomains } from '@archipelia/server';
import { createNodeRest } from '@archipelia/server/node';
import { loadConfig } from '../config/load-config';
import { ensureEngine } from '../engine/ensure-engine';
import { resolveTls } from '../tls/resolve-tls';
import { jobLogger } from './job-logger';

const startServer = async (host: ServerHost<CoreDomains>): Promise<RunningServer> => {
  const { log, domains } = host;
  if (!domains) throw new Error('the server needs the data domains of its host');
  const { config, file } = loadConfig(host.dataDir, host.args, process.env);
  log(file ? `configuration from ${file}` : 'no configuration file: the defaults and the environment apply');
  const started = startCore(host, createNodeRest(host, { automation: config.loopback, onJob: jobLogger(log) }));
  try {
    const tls = await resolveTls(config.tls, domains.domain(DOMAIN.server));
    if (tls) log(`TLS ${tls.source}: SHA-256 fingerprint ${tls.fingerprint}`);
    else log('TLS is off: lobbies are plain ws and the internet modes stay LAN only', 'warn');
    const endpoint = await started.listen({
      port: config.port,
      mode: config.network,
      publicAddressLookup: config.publicLookup,
      ...(tls ? { tls: { key: tls.key, cert: tls.cert } } : {}),
    });
    log(`lobby server on ${endpoint.secure ? 'wss' : 'ws'}://${endpoint.host}:${endpoint.port}, network mode ${config.network}`);
    await started.core.adminToken();
    void ensureEngine(started.core, config.engine, log).catch((error: unknown) => log(`the engine setup stopped: ${String(error)}`, 'error'));
    return started;
  } catch (error) {
    await started.stop();
    throw error;
  }
};

export { startServer };
