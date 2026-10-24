/* @layer core @kind logic */
import { hostBinding } from '@archipelia/hosts';
import { DEFAULT_PORT } from '@archipelia/lobby-protocol';
import type { Core } from '../core/core.type';
import { SERVER_VERSION } from '../core/core-lobbies.constants';
import type { CoreNetwork } from '../core/core-ports.type';
import { startListener } from '../listener/start-listener';
import type { RunningListener } from '../listener/listener.type';
import type { LobbyListen } from './start-core.type';

const startLobbyListener = (core: Core, network: CoreNetwork, options: LobbyListen = {}): Promise<RunningListener> =>
  startListener({
    service: core.lobbies,
    admin: { token: core.adminToken, watch: core.watchLobbies, engines: () => core.engine.overview() },
    host: hostBinding(network.automation, network.lanHost).bindHost,
    port: options.port ?? DEFAULT_PORT,
    serverVersion: options.serverVersion ?? SERVER_VERSION,
    ...(options.tls ? { tls: options.tls } : {}),
  });

export { startLobbyListener };
