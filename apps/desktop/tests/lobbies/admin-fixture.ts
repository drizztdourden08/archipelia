/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import type { CoreDomains, LobbyEndpoint, LobbyListen } from '@archipelia/server';
import { startCore } from '@archipelia/server';
import { createNodeDomains, createNodeRest } from '@archipelia/server/node';

const ENGINE = { id: 'e', ap: '0.6.8', python: '3.12.0' };

const startFixture = async (listen: LobbyListen = { port: 0, mode: 'off' }) => {
  const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-admin-'));
  const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined, domains: createNodeDomains(dataDir) };
  const started = startCore(host, createNodeRest(host, { automation: true }));
  const endpoint: LobbyEndpoint = await started.listen(listen);
  const token = await started.core.adminToken();
  const stop = async () => {
    await started.stop();
    await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  };
  return { started, endpoint, token, host, stop };
};

export { ENGINE, startFixture };
