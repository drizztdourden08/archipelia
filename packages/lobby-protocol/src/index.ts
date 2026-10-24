/* @layer protocol @kind barrel */
export { decodeMessage } from './codec/decode-message';
export { encodeMessage } from './codec/encode-message';
export { createError } from './codec/create-error';
export { closeCodeOf } from './codec/close-code-of';
export { validateMessage } from './codec/validate-message';
export type { DecodeOptions, DecodeOutcome, ErrorContext } from './codec/codec.type';
export { buildBeacon } from './discovery/build-beacon';
export { buildDiscoveryTxt } from './discovery/build-discovery-txt';
export { parseBeacon } from './discovery/parse-beacon';
export { parseDiscoveryTxt } from './discovery/parse-discovery-txt';
export {
  BEACON_EXPIRY_MS,
  BEACON_INTERVAL_MS,
  BEACON_MAX_BYTES,
  BEACON_PORT,
  DISCOVERY_SERVICE,
  DISCOVERY_TXT_KEYS,
} from './discovery/discovery.constants';
export { DISCOVERY_BEACON_SCHEMA, DISCOVERY_RECORD_SCHEMA } from './discovery/discovery-schemas';
export type {
  DiscoveryBeacon,
  DiscoveryFailure,
  DiscoveryParse,
  DiscoveryRecord,
} from './discovery/discovery.type';
export { checkHello } from './hello/check-hello';
export { formatLobbyCode } from './lobby/format-lobby-code';
export { CODE_ALPHABET, CODE_LENGTH } from './lobby/lobby-code.constants';
export { lobbyJoinable } from './lobby/lobby-joinable';
export { lobbyNotFoundFailure } from './lobby/lobby-not-found-failure';
export { negotiateProtocol } from './lobby/negotiate-protocol';
export { normalizeLobbyCode } from './lobby/normalize-lobby-code';
export { rateLimitedFailure } from './lobby/rate-limited-failure';
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
} from './messages/server.type';
export type { ClientInfo, Hello, LobbyInfoRequest, ProtocolOffer, SlotEntry, WorldEntry, WorldProof } from './messages/hello.type';
export type { ClientMessage, ProtocolMessage, ServerMessage, UnknownMessage } from './messages/message.type';
export type {
  FileChunk,
  FileDone,
  FileGet,
  Leave,
  Ready,
  SlotsOk,
  SlotsSet,
  UploadBegin,
  UploadChunk,
  UploadDone,
  UploadReady,
} from './messages/upload.type';
export { CLOSE_CODES } from './protocol/close-codes.constants';
export { ERROR_CODE_LIST, ERROR_RULES } from './protocol/error-rules.constants';
export type { ErrorFatality, ErrorRule } from './protocol/error-rules.type';
export {
  CAPABILITIES,
  CLIENT_MESSAGE_TYPES,
  DEFAULT_LIMITS,
  DEFAULT_PORT,
  HELLO_TIMEOUT_MS,
  IDLE_TIMEOUT_MS,
  LOBBY_INFO_LIMIT,
  LOBBY_INFO_MAX_REQUEST_BYTES,
  LOBBY_INFO_WINDOW_MS,
  LOBBY_PATH,
  PING_INTERVAL_MS,
  PRE_WELCOME_MAX_MESSAGE_BYTES,
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  REQUIRED_CAPABILITY,
  SERVER_MESSAGE_TYPES,
  SUPPORTED_PROTOCOL_VERSIONS,
  WORLD_CAPABILITY,
  WRONG_CODE_LIMIT,
  WRONG_CODE_WINDOW_MS,
} from './protocol/protocol.constants';
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
} from './protocol/protocol.type';
export { resumeOutcome } from './resume/resume-outcome';
export type { ResumeOutcome } from './resume/resume-outcome.type';
export { CLIENT_SCHEMAS, SERVER_SCHEMAS } from './schemas/message-schemas';
export { TOKEN_LENGTH } from './schemas/patterns.constants';
export { SCHEMA_DEFS } from './schemas/schema-defs';
export { validateSchema } from './validate/validate-schema';
export type { Schema, SchemaProblem } from './validate/validate.type';
export { checkClientVersion } from './version/check-client-version';
export { checkWorldRange } from './version/check-world-range';
export type { WorldApRange } from './version/check-world-range.type';
export { checkWorldVersion } from './version/check-world-version';
export { compareApVersions } from './version/compare-ap-versions';
export { parseApVersion } from './version/parse-ap-version';
