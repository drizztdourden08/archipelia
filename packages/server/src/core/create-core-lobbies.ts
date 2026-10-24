/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { DOMAIN } from '@archipelia/model';
import { sessionEngineOf } from '@archipelia/sessions';
import { createLobbyService } from '../lobby/create-lobby-service';
import { buildOverlay } from '../lobby/overlay/build-overlay';
import { createLobbyStore } from '../lobby/store/create-lobby-store';
import { createLobbyTrust } from '../lobby/trust/create-lobby-trust';
import { adminToken } from '../listener/admin/admin-token';
import type { CoreLobbyDeps } from './core-lobbies.type';
import { SERVER_VERSION } from './core-lobbies.constants';

const createCoreLobbies = ({ ports, sessions, runtime, runtimeFor, sessionFiles }: CoreLobbyDeps) => {
  const watchers = new Set<(lobby: Lobby) => void>();
  const lobbies = createLobbyService({
    store: createLobbyStore(ports.domain(DOMAIN.lobbies)),
    trust: createLobbyTrust(ports.domain(DOMAIN.cache)),
    runner: { run: (template, lobby) => sessions().run(template, undefined, lobby), stop: (id) => sessions().stop(id), running: (id) => sessions().running(id), runtimeFor, output: sessionFiles },
    overlay: buildOverlay,
    secrets: ports.secrets,
    activeEngine: () => runtime().then(sessionEngineOf, () => undefined),
    serverVersion: ports.environment?.version ?? SERVER_VERSION,
    log: (message) => ports.log(message, 'warn'),
    emit: (lobby) => {
      ports.emit({ kind: 'lobby', lobby });
      for (const watcher of watchers) watcher(lobby);
    },
  });
  const watchLobbies = (watcher: (lobby: Lobby) => void) => {
    watchers.add(watcher);
    return () => {
      watchers.delete(watcher);
    };
  };
  return { lobbies, watchLobbies, adminToken: adminToken(ports.domain(DOMAIN.server), ports.log) };
};

export { createCoreLobbies };
