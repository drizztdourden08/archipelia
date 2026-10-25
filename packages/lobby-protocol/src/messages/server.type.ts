/* @layer protocol @kind types */
import type {
  ErrorCode,
  Limits,
  LobbyAdmission,
  LobbyPhase,
  MemberAdmission,
  RoomState,
  RoomTls,
  SlotState,
  TrustLevel,
} from '../protocol/protocol.type';

type EngineRef = { ap: string };

type LobbyInfoReply = {
  type: 'lobby.info.reply';
  re?: number;
  protocol: { name: string; version: number };
  server: { name: string; version: string };
  lobby: {
    name: string;
    engine: EngineRef;
    phase: LobbyPhase;
    joinable: boolean;
    admission: LobbyAdmission;
    allowUnlisted: boolean;
    worlds: { game: string; worldVersion: string }[];
    requires: { capabilities: string[] };
  };
  limits: Limits;
};

type Welcome = {
  type: 'welcome';
  re?: number;
  protocol: { name: string; version: number };
  server: { name: string; version: string };
  lobby: {
    id: string;
    name: string;
    engine: EngineRef;
    admission: LobbyAdmission;
    allowUnlisted: boolean;
    phase: LobbyPhase;
  };
  member: { id: string; token: string; admission: MemberAdmission; trust: TrustLevel; resumed?: boolean };
  need: string[];
  limits: Limits;
};

type ErrorMessage = {
  type: 'error';
  re?: number;
  code: ErrorCode;
  message: string;
  fatal: boolean;
  field?: string;
  slot?: string;
  retryAfter?: number;
  supported?: number[];
  lobbyAp?: string;
};

type AdmissionMessage = { type: 'admission'; state: MemberAdmission; reason?: string };

type StateSlot = { name: string; game: string; state: SlotState; reason?: string };

type StateMember = {
  id: string;
  displayName: string;
  client: { name: string; version: string };
  trust: TrustLevel;
  admission: MemberAdmission;
  ready: boolean;
  slots: StateSlot[];
};

type LobbyState = {
  type: 'lobby.state';
  rev: number;
  phase: LobbyPhase;
  engine: EngineRef;
  members: StateMember[];
  others?: { approved: number; pending: number };
};

type LobbyProgress = { type: 'lobby.progress'; phase: LobbyPhase; step: string; fraction: number };

type StartedFile = { fileId: string; name: string; size: number; sha256: string };

type LobbyStarted = {
  type: 'lobby.started';
  seed: string;
  engine: EngineRef;
  room: {
    address: string;
    host: string;
    port: number;
    tls: RoomTls;
    password?: string;
    roomUrl?: string;
    localAddress?: string;
  };
  slots: { name: string; game: string; team: number; files: StartedFile[] }[];
};

type LobbyFailed = { type: 'lobby.failed'; stage: string; message: string };

type RoomStatus = { type: 'room.status'; state: RoomState; address?: string };

export type {
  AdmissionMessage,
  EngineRef,
  ErrorMessage,
  LobbyFailed,
  LobbyInfoReply,
  LobbyProgress,
  LobbyStarted,
  LobbyState,
  RoomStatus,
  StartedFile,
  StateMember,
  StateSlot,
  Welcome,
};
