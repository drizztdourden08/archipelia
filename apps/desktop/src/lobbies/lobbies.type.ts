/* @layer renderer-app @kind types */
import type { AdminLobby, HostTarget, LobbyAdmission, SessionEngine } from '@archipelia/model';
import type { ReachStatus } from '@archipelia/server';
import type { LanServer, NetworkMode } from '@archipelia/server/network';
import type { LOBBY_REQUESTS } from './lobbies.constants';

type LobbyServerOptions = { mode: NetworkMode; publicLookup: boolean };

type LobbyServerState = 'starting' | 'listening' | 'failed';

type RoomPasswordKeeping = 'vault' | 'memory';

type LobbyServerStatus = {
  state: LobbyServerState;
  error?: string;
  options: LobbyServerOptions;
  automation: boolean;
  roomPasswords: RoomPasswordKeeping;
  lanAddress: string;
  port?: number;
  secure?: boolean;
  serverId?: string;
  reach?: ReachStatus;
};

type ServerInfo = { name: string; version: string; port: number; sandbox: string; tls: boolean };

type LobbyServerView = { info: ServerInfo; engine?: SessionEngine };

type LobbyDraft = { name: string; admission: LobbyAdmission; allowUnlisted: boolean; maxSlots: number; room: HostTarget };

type LobbyRequestType = (typeof LOBBY_REQUESTS)[number];

type LobbyRequest = { type: LobbyRequestType; params: Record<string, unknown> };

type LobbyEvent = { serverId: string; lobby: AdminLobby };

type LanEntry = LanServer & { self: boolean };

type LobbyServerTest = { ok: boolean; message: string; certSha256?: string; info?: ServerInfo };

type LobbyReviewPlay = { code: string; name: string; ap: string };

type LobbyReviewHost = { id: number; action: string; world?: string };

type ServerPlace = { local: boolean; label: string; address: string | null; where: string };

type ServerTarget = { secure: boolean; host: string; port: number };

export type {
  LanEntry, LobbyDraft, LobbyEvent, LobbyRequest, LobbyReviewHost, LobbyReviewPlay, LobbyServerOptions, LobbyServerState,
  LobbyServerStatus, LobbyServerTest, LobbyServerView, ServerInfo, ServerPlace, ServerTarget,
};
