/* @layer core @kind logic */
import type { Lobby, SessionTemplate } from '@archipelia/model';
import { DOMAIN } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { sessionEngineOf } from '@archipelia/sessions';
import { createLobbyService } from '../lobby/create-lobby-service';
import { buildOverlay } from '../lobby/overlay/build-overlay';
import { createLobbyStore } from '../lobby/store/create-lobby-store';
import { createLobbyTrust } from '../lobby/trust/create-lobby-trust';
import { adminToken } from '../listener/admin/admin-token';
import type { CoreLobbyDeps } from './core-lobbies.type';
import { SERVER_VERSION } from './core-lobbies.constants';

const createCoreLobbies = ({ ports, sessions, runtime, runtimeFor, sessionFiles, sandbox }: CoreLobbyDeps) => {
  const watchers = new Set<(lobby: Lobby) => void>();
  const runOf = (template: SessionTemplate, lobby: LobbyRun) =>
    ports.lobbyRun
      ? ports.lobbyRun(template, lobby, { output: sessionFiles, report: (event) => lobbies.onSessionEvent(event) })
      : sessions().run(template, undefined, lobby);
  const lobbies = createLobbyService({
    store: createLobbyStore(ports.domain(DOMAIN.lobbies)),
    trust: createLobbyTrust(ports.domain(DOMAIN.cache)),
    runner: { run: runOf, stop: (id) => sessions().stop(id), running: (id) => sessions().running(id), runtimeFor, output: sessionFiles },
    overlay: buildOverlay,
    sandbox,
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
