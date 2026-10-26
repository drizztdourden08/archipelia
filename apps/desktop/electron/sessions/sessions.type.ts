/* @layer electron-main @kind types */
import type { AdminLobby, DataFiles, SessionPlayer, SessionTemplate } from '@archipelia/model';
import type { HostPlayerSlot, LobbyRequest, LobbyServerStatus, PendingClose } from '../../src/lobbies/lobbies.type';

type NetworkSwitch = { status: () => LobbyServerStatus; apply: (options: unknown) => Promise<unknown> };

type SessionLobbyDeps = {
  act: (request: LobbyRequest) => Promise<AdminLobby>;
  list: () => Promise<AdminLobby[]>;
  slotOf: (player: SessionPlayer) => Promise<HostPlayerSlot>;
  sharePassword?: (lobbyId: string, passwordRef: string) => Promise<void>;
};

type LobbyOps = Pick<SessionLobbyDeps, 'act' | 'list'>;

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

export type { CloserDeps, NetworkSwitch, SessionLobbyDeps, TemplateStore };
