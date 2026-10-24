/* @layer core @kind types */
import type { LobbyHub } from './hub/lobby-hub.type';
import type { LobbyServiceDeps } from './lobby-service.type';
import type { Lobby } from '@archipelia/model';
import type { createLobbyBook } from './state/create-lobby-book';
import type { createQueue } from './state/create-queue';

type LobbyBook = ReturnType<typeof createLobbyBook>;

type LobbyContext = {
  deps: LobbyServiceDeps;
  book: LobbyBook;
  hub: LobbyHub;
  now: () => number;
  queue: ReturnType<typeof createQueue>;
  publish: (lobby: Lobby) => void;
};

export type { LobbyContext };
