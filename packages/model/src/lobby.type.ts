/* @layer core @kind types */
import type { GeneratorSettings, HostTarget, PlayerOrigin, RunSource, ServerSettings, SessionEngine } from './session.type';

type LobbyAdmission = 'open' | 'host-approval';

type LobbyPhase = 'open' | 'locked' | 'generating' | 'hosting' | 'closed' | 'failed';

type MemberAdmission = 'pending' | 'approved' | 'refused' | 'removed';

type TrustLevel = 'verified' | 'unlisted';

type LobbyLimits = { worldBytes: number; yamlBytes: number; memberBytes: number };

type LobbyOptions = {
  admission: LobbyAdmission;
  allowUnlisted: boolean;
  allowedGames?: string[];
  maxSlots: number;
  limits: LobbyLimits;
  room: HostTarget;
  generator: GeneratorSettings;
  server: ServerSettings;
};

type ClientMeta = {
  id: string;
  name: string;
  version: string;
  build?: string;
  platform: { os: string; arch: string };
  homepage?: string;
  archipelago: string;
  capabilities: string[];
};

type UploadTrust = { level: TrustLevel; clientId?: string; detail: string; checkedAt: number };

type WorldUpload = {
  sha256: string;
  size: number;
  game: string;
  module: string;
  worldVersion: string;
  memberId: string;
  proof?: unknown;
  trust: UploadTrust;
  consent?: { allowed: boolean; at: number };
};

type SlotOrigin = Exclude<PlayerOrigin, 'joined'>;

type LobbySource = Omit<RunSource, 'match'>;

type SlotState = 'uploading' | 'checking' | 'waiting-consent' | 'ok' | 'refused';

type SlotUpload = {
  name: string;
  game: string;
  yamlSha256: string;
  yamlSize: number;
  worldSha256?: string;
  worldVersion?: string;
  origin?: SlotOrigin;
  state: SlotState;
  reason?: string;
};

type LobbyMember = {
  id: string;
  kind: 'host' | 'client';
  displayName: string;
  seat?: string;
  openSeat?: true;
  client?: ClientMeta;
  tokenHash?: string;
  admission: MemberAdmission;
  reason?: string;
  trust: TrustLevel;
  ready: boolean;
  slots: SlotUpload[];
  joinedAt: number;
  lastSeenAt: number;
};

type LobbyRoomFile = { fileId: string; slot: string; name: string; entry: string; size: number; sha256: string };

type LobbyRoom = {
  seed: string;
  zip: string;
  host: string;
  port: number;
  tls: 'yes' | 'no' | 'auto';
  roomUrl?: string;
  passwordRef?: string;
  files: LobbyRoomFile[];
  state: 'hosting' | 'stopped';
};

type LobbyFailure = { stage: 'generate' | 'host'; message: string };

type Lobby = {
  id: string;
  code: string;
  name: string;
  phase: LobbyPhase;
  rev: number;
  engine: SessionEngine;
  options: LobbyOptions;
  source?: LobbySource;
  seats?: string[];
  openSeats?: number;
  members: LobbyMember[];
  worlds: WorldUpload[];
  nextMember: number;
  sessionId?: string;
  room?: LobbyRoom;
  failure?: LobbyFailure;
  createdAt: number;
  closesAt: number;
};

type AdminLobbyMember = Omit<LobbyMember, 'tokenHash'>;

type AdminWorld = Omit<WorldUpload, 'proof'> & { proofSent: boolean; runsUnconfined?: boolean; consentNote?: string };

type AdminLobby = Omit<Lobby, 'members' | 'worlds'> & { members: AdminLobbyMember[]; worlds: AdminWorld[] };

type MemberYamlSlot = { name: string; game: string; yaml: string | null };

type MemberYaml = { memberId: string; slots: MemberYamlSlot[] };

export type {
  AdminLobby, AdminLobbyMember, AdminWorld, ClientMeta, Lobby, LobbyAdmission, LobbyFailure, LobbyLimits, LobbyMember, LobbySource, LobbyOptions, LobbyPhase, LobbyRoom, LobbyRoomFile,
  MemberAdmission, MemberYaml, MemberYamlSlot, SlotOrigin, SlotState, SlotUpload, TrustLevel, UploadTrust, WorldUpload,
};
