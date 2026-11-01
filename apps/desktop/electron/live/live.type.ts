/* @layer electron-main @kind types */
import type { DataFiles, SessionTemplate } from '@archipelia/model';
import type { LibraryView } from '@archipelia/sessions/validation';
import type { PendingClose } from '../../src/lobbies/lobbies.type';
import type { LiveTab } from '../../src/live/live.type';
import type { SessionLobbyDeps } from '../sessions/sessions.type';
import type { createLiveSessions } from './create-live-sessions';

type LiveDeps = {
  files: DataFiles;
  emit: (tabs: LiveTab[]) => void;
  now?: () => number;
  id?: () => string;
};

type TabInput = Omit<LiveTab, 'tabId' | 'openedAt'>;

type LiveStore = ReturnType<typeof createLiveSessions>;

type SavedTemplates = {
  get: (id: string) => Promise<SessionTemplate | null>;
  list: () => Promise<SessionTemplate[]>;
  save: (template: SessionTemplate) => Promise<SessionTemplate>;
};

type LobbyOps = Pick<SessionLobbyDeps, 'act' | 'list'>;

type LiveServiceDeps = {
  store: LiveStore;
  templates: SavedTemplates;
  library: () => Promise<LibraryView>;
  lobbies: (serverId: string) => Promise<LobbyOps>;
  slotOf: SessionLobbyDeps['slotOf'];
  beforeOpen: NonNullable<SessionLobbyDeps['beforeOpen']>;
  assertConsent: NonNullable<SessionLobbyDeps['assertConsent']>;
  beforeRun: NonNullable<SessionLobbyDeps['beforeRun']>;
  closer: { close: (ref: PendingClose) => Promise<{ closed: boolean }>; quietIfIdle: () => Promise<unknown> };
  cancelRun: (runId: string) => Promise<unknown>;
};

export type { LiveDeps, LiveServiceDeps, TabInput };
