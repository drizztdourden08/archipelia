/* @layer electron-main @kind types */
import type { AdminLobby, DataFiles, HostedPlayer, LobbySource, SessionTemplate } from '@archipelia/model';
import type { LiveTab } from '../../src/live/live.type';
import type { HostPlayerSlot, LobbyRequest, LobbyServerStatus, PendingClose } from '../../src/lobbies/lobbies.type';

type NetworkSwitch = { status: () => LobbyServerStatus; apply: (options: unknown) => Promise<unknown> };

type SessionLobbyDeps = {
  act: (request: LobbyRequest) => Promise<AdminLobby>;
  list: () => Promise<AdminLobby[]>;
  slotOf: (player: HostedPlayer) => Promise<HostPlayerSlot>;
  beforeOpen?: (template: SessionTemplate) => Promise<void>;
  assertConsent?: (template: SessionTemplate) => void;
  beforeRun?: (lobbyId: string, template: SessionTemplate) => Promise<void>;
};

type LobbyOps = Pick<SessionLobbyDeps, 'act' | 'list'>;

type CloserDeps = {
  files: DataFiles;
  opsFor: (serverId: string) => Promise<LobbyOps>;
  live: () => Promise<LiveTab[]>;
  quiet: () => Promise<unknown>;
  emit: (pending: PendingClose[]) => void;
  forget?: (lobbyId: string) => Promise<void>;
  retryMs?: number;
  retryMaxMs?: number;
};

type RunPreparation = {
  server: NetworkSwitch;
  setLanRoom: (lobbyId: string, lan: boolean) => unknown;
  sharePassword: (lobbyId: string, passwordRef: string) => Promise<void>;
};

type SyncPlan = { template: SessionTemplate; lobbyId: string; source: LobbySource; savedNames: ReadonlySet<string> };

type StartPlan = Omit<SyncPlan, 'lobbyId'> & { lobbyId?: string };

export type { CloserDeps, NetworkSwitch, RunPreparation, SessionLobbyDeps, StartPlan, SyncPlan };
