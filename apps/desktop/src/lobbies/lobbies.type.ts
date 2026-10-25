/* @layer renderer-app @kind types */
import type { AdminLobby, DirectConnection, SessionEngine } from '@archipelia/model';
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

type DirectOptions = Pick<DirectConnection, 'admission' | 'allowUnlisted'>;

type PendingClose = { templateId: string; serverId: string; lobbyId: string };

type LobbyRequestType = (typeof LOBBY_REQUESTS)[number];

type LobbyRequest = { type: LobbyRequestType; params: Record<string, unknown> };

type LobbyEvent = { serverId: string; lobby: AdminLobby };

type LanEntry = LanServer & { self: boolean };

type LobbyServerTest = { ok: boolean; message: string; certSha256?: string; info?: ServerInfo };

type LobbyReviewPlay = { code: string; name: string; ap: string };

type LobbyReviewHost = { id: number; action: string; world?: string };

type ServerPlace = { local: boolean; label: string; address: string | null; where: string };

type ServerTarget = { secure: boolean; host: string; port: number };

type JoinAddress = { target: ServerTarget } | { problem: string };

type LobbyProbe = {
  ok: boolean;
  message: string;
  name?: string;
  ap?: string;
  phase?: string;
  joinable?: boolean;
  admission?: string;
  allowUnlisted?: boolean;
  games?: string[];
};

type HostPlayerSlot = { name: string; game: string; yaml: string; worldVersion: string };

export type {
  DirectOptions, HostPlayerSlot, JoinAddress, LanEntry, LobbyEvent, LobbyProbe, LobbyRequest, LobbyReviewHost, LobbyReviewPlay, LobbyServerOptions, LobbyServerState,
  LobbyServerStatus, LobbyServerTest, LobbyServerView, PendingClose, ServerInfo, ServerPlace, ServerTarget,
};
