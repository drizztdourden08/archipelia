/* @layer protocol @kind config */

const PROTOCOL_NAME = 'archipelia-lobby';
const PROTOCOL_VERSION = 1;
const SUPPORTED_PROTOCOL_VERSIONS = [1];

const LOBBY_PATH = '/archipelia/lobby';
const DEFAULT_PORT = 38290;

const PRE_WELCOME_MAX_MESSAGE_BYTES = 65536;
const LOBBY_INFO_MAX_REQUEST_BYTES = 1024;

const HELLO_TIMEOUT_MS = 15000;
const PING_INTERVAL_MS = 30000;
const IDLE_TIMEOUT_MS = 90000;

const WRONG_CODE_LIMIT = 10;
const WRONG_CODE_WINDOW_MS = 60000;
const LOBBY_INFO_LIMIT = 30;
const LOBBY_INFO_WINDOW_MS = 60000;

const MAX_SLOTS_PER_HELLO = 8;
const MAX_WORLDS_PER_HELLO = 8;

const DEFAULT_LIMITS = {
  maxMessageBytes: 1048576,
  chunkBytes: 262144,
  maxWorldBytes: 67108864,
  maxYamlBytes: 262144,
  maxMemberBytes: 134217728,
};

const CAPABILITIES = ['slots.yaml', 'worlds.upload', 'seed.upload'] as const;
const REQUIRED_CAPABILITY = 'slots.yaml';
const WORLD_CAPABILITY = 'worlds.upload';

const PLATFORM_OS = ['windows', 'macos', 'linux', 'android', 'web', 'other'] as const;
const PLATFORM_ARCH = ['x64', 'arm64', 'other'] as const;

const LOBBY_ADMISSIONS = ['open', 'host-approval'] as const;
const MEMBER_ADMISSIONS = ['pending', 'approved', 'refused', 'removed'] as const;
const LOBBY_PHASES = ['open', 'locked', 'generating', 'hosting', 'closed', 'failed'] as const;
const TRUST_LEVELS = ['verified', 'unlisted'] as const;
const SLOT_STATES = ['uploading', 'checking', 'waiting-consent', 'ok', 'refused'] as const;
const ROOM_TLS = ['yes', 'no', 'auto'] as const;
const ROOM_STATES = ['hosting', 'stopped'] as const;
const PROOF_METHODS = ['github-attestation', 'none', 'ed25519'] as const;
const UPLOAD_KINDS = ['world', 'yaml'] as const;

const CLIENT_MESSAGE_TYPES = [
  'lobby.info',
  'hello',
  'ready',
  'leave',
  'slots.set',
  'upload.begin',
  'upload.chunk',
  'file.get',
] as const;

const SERVER_MESSAGE_TYPES = [
  'lobby.info.reply',
  'welcome',
  'error',
  'admission',
  'lobby.state',
  'lobby.progress',
  'lobby.started',
  'lobby.failed',
  'room.status',
  'slots.ok',
  'upload.ready',
  'upload.done',
  'file.chunk',
  'file.done',
] as const;

export {
  CAPABILITIES,
  CLIENT_MESSAGE_TYPES,
  DEFAULT_LIMITS,
  DEFAULT_PORT,
  HELLO_TIMEOUT_MS,
  IDLE_TIMEOUT_MS,
  LOBBY_ADMISSIONS,
  LOBBY_INFO_LIMIT,
  LOBBY_INFO_MAX_REQUEST_BYTES,
  LOBBY_INFO_WINDOW_MS,
  LOBBY_PATH,
  LOBBY_PHASES,
  MAX_SLOTS_PER_HELLO,
  MAX_WORLDS_PER_HELLO,
  MEMBER_ADMISSIONS,
  PING_INTERVAL_MS,
  PLATFORM_ARCH,
  PLATFORM_OS,
  PRE_WELCOME_MAX_MESSAGE_BYTES,
  PROOF_METHODS,
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  REQUIRED_CAPABILITY,
  ROOM_STATES,
  ROOM_TLS,
  SERVER_MESSAGE_TYPES,
  SLOT_STATES,
  SUPPORTED_PROTOCOL_VERSIONS,
  TRUST_LEVELS,
  UPLOAD_KINDS,
  WORLD_CAPABILITY,
  WRONG_CODE_LIMIT,
  WRONG_CODE_WINDOW_MS,
};
