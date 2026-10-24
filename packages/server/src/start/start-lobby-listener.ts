/* @layer core @kind logic */
import { hostBinding } from '@archipelia/hosts';
import { DEFAULT_PORT } from '@drizztdourden08/archipelia-lobby-protocol';
import { DOMAIN } from '@archipelia/model';
import { SERVER_VERSION } from '../core/core-lobbies.constants';
import { startListener } from '../listener/start-listener';
import { createNodeMappingPorts, createNodeNetworkPorts, createPublicLookup, DEFAULT_NETWORK_MODE } from '../network';
import type { ReachPorts } from './reach/reach.type';
import { serverIdentity } from './reach/server-identity';
import { startReach } from './reach/start-reach';
import type { LobbyEndpoint, LobbyListen, ListenPorts } from './start-core.type';

const nodeReachPorts = (lookupOn: boolean): ReachPorts => {
  const lookup = lookupOn ? createPublicLookup() : null;
  return { network: createNodeNetworkPorts(), mapping: createNodeMappingPorts(lookup), lookup };
};

const startLobbyListener = async ({ core, network, log, domain }: ListenPorts, options: LobbyListen = {}): Promise<LobbyEndpoint> => {
  const listener = await startListener({
    service: core.lobbies,
    admin: { token: core.adminToken, watch: core.watchLobbies, engines: () => core.engine.overview() },
    host: hostBinding(network.automation, network.lanHost).bindHost,
    port: options.port ?? DEFAULT_PORT,
    serverVersion: options.serverVersion ?? SERVER_VERSION,
    ...(options.tls ? { tls: options.tls } : {}),
    log,
  });
  const reach = await startReach({
    port: listener.port, secure: listener.secure, mode: options.mode ?? DEFAULT_NETWORK_MODE, automation: network.automation, log,
    ports: options.reachPorts ?? nodeReachPorts(options.publicAddressLookup !== false),
    server: await serverIdentity(domain(DOMAIN.server)),
    lobbies: () => core.lobbies.list(),
    fallbackAp: () => core.runtime().then((runtime) => runtime.apVersion, () => undefined),
    watch: core.watchLobbies,
  });
  const stop = async () => {
    await reach.stop();
    await listener.stop();
  };
  return { host: listener.host, port: listener.port, secure: listener.secure, reach: reach.status, stop };
};

export { startLobbyListener };
