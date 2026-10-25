/* @layer electron-main @kind types */
import type { AdminLobby, DataFiles, SessionPlayer, SessionTemplate } from '@archipelia/model';
import type { HostPlayerSlot, LobbyRequest, PendingClose } from '../../src/lobbies/lobbies.type';

type DirectRunDeps = {
  act: (request: LobbyRequest) => Promise<AdminLobby>;
  list: () => Promise<AdminLobby[]>;
  slotOf: (player: SessionPlayer) => Promise<HostPlayerSlot>;
};

type LobbyOps = Pick<DirectRunDeps, 'act' | 'list'>;

type CloserDeps = {
  files: DataFiles;
  opsFor: (serverId: string) => Promise<LobbyOps>;
  templates: () => Promise<SessionTemplate[]>;
  quiet: () => Promise<unknown>;
  emit: (pending: PendingClose[]) => void;
  retryMs?: number;
  retryMaxMs?: number;
};

type TemplateStore = { get: (id: string) => Promise<SessionTemplate | null>; remove: (id: string) => Promise<void> };

export type { CloserDeps, DirectRunDeps, LobbyOps, TemplateStore };
