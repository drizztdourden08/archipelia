/* @layer core @kind logic */
import { createLobbyAdmin } from './host/create-lobby-admin';
import { createLobbyHub } from './hub/create-lobby-hub';
import type { LobbyContext } from './lobby-context.type';
import type { LobbyServiceDeps } from './lobby-service.type';
import { createLobbyProtocol } from './protocol/create-lobby-protocol';
import { createSessionTracker } from './start/create-session-tracker';
import { createLobbyBook } from './state/create-lobby-book';
import { createQueue } from './state/create-queue';
import { createUploads } from './upload/create-uploads';

const createLobbyService = (deps: LobbyServiceDeps) => {
  const hub = createLobbyHub(deps.serverVersion);
  const now = deps.now ?? Date.now;
  const ctx: LobbyContext = {
    deps,
    hub,
    book: createLobbyBook(deps.store, now),
    now,
    queue: createQueue(),
    uploads: createUploads(() => ctx),
    publish: (lobby) => {
      hub.publish(lobby);
      deps.emit(lobby);
    },
  };
  return { ...createLobbyAdmin(ctx), protocol: createLobbyProtocol(ctx), onSessionEvent: createSessionTracker(ctx) };
};

export { createLobbyService };
