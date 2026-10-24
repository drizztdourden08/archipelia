/* @layer core @kind logic */
import { createLobbyAdmin } from './host/create-lobby-admin';
import { createLobbyHub } from './hub/create-lobby-hub';
import type { LobbyContext } from './lobby-context.type';
import type { LobbyServiceDeps } from './lobby-service.type';
import { createLobbyProtocol } from './protocol/create-lobby-protocol';
import { createSessionTracker } from './start/create-session-tracker';
import { createLobbyBook } from './state/create-lobby-book';
import { createQueue } from './state/create-queue';

const createLobbyService = (deps: LobbyServiceDeps) => {
  const hub = createLobbyHub(deps.serverVersion);
  const ctx: LobbyContext = {
    deps,
    hub,
    book: createLobbyBook(deps.store),
    now: deps.now ?? Date.now,
    queue: createQueue(),
    publish: (lobby) => {
      hub.publish(lobby);
      deps.emit(lobby);
    },
  };
  return { ...createLobbyAdmin(ctx), protocol: createLobbyProtocol(ctx), onSessionEvent: createSessionTracker(ctx) };
};

export { createLobbyService };
