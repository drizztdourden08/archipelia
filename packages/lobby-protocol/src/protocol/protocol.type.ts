/* @layer protocol @kind types */
import type {
  CAPABILITIES,
  CLIENT_MESSAGE_TYPES,
  LOBBY_ADMISSIONS,
  LOBBY_PHASES,
  MEMBER_ADMISSIONS,
  PLATFORM_ARCH,
  PLATFORM_OS,
  PROOF_METHODS,
  ROOM_STATES,
  ROOM_TLS,
  SERVER_MESSAGE_TYPES,
  SLOT_STATES,
  TRUST_LEVELS,
  UPLOAD_KINDS,
} from './protocol.constants';
import type { ERROR_RULES } from './error-rules.constants';

type Capability = (typeof CAPABILITIES)[number];
type ClientMessageType = (typeof CLIENT_MESSAGE_TYPES)[number];
type ServerMessageType = (typeof SERVER_MESSAGE_TYPES)[number];
type Direction = 'c2s' | 's2c';
type ErrorCode = keyof typeof ERROR_RULES;
type LobbyAdmission = (typeof LOBBY_ADMISSIONS)[number];
type LobbyPhase = (typeof LOBBY_PHASES)[number];
type MemberAdmission = (typeof MEMBER_ADMISSIONS)[number];
type PlatformArch = (typeof PLATFORM_ARCH)[number];
type PlatformOs = (typeof PLATFORM_OS)[number];
type ProofMethod = (typeof PROOF_METHODS)[number];
type RoomState = (typeof ROOM_STATES)[number];
type RoomTls = (typeof ROOM_TLS)[number];
type SlotState = (typeof SLOT_STATES)[number];
type TrustLevel = (typeof TRUST_LEVELS)[number];
type UploadKind = (typeof UPLOAD_KINDS)[number];

type Limits = {
  maxMessageBytes: number;
  chunkBytes: number;
  maxWorldBytes: number;
  maxYamlBytes: number;
  maxMemberBytes: number;
};

type Failure = {
  code: ErrorCode;
  message: string;
  field?: string;
  slot?: string;
  retryAfter?: number;
  supported?: number[];
  lobbyAp?: string;
};

export type {
  Capability,
  ClientMessageType,
  Direction,
  ErrorCode,
  Failure,
  Limits,
  LobbyAdmission,
  LobbyPhase,
  MemberAdmission,
  PlatformArch,
  PlatformOs,
  ProofMethod,
  RoomState,
  RoomTls,
  ServerMessageType,
  SlotState,
  TrustLevel,
  UploadKind,
};
