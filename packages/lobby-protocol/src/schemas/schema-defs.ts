/* @layer protocol @kind data */
import {
  LOBBY_ADMISSIONS,
  LOBBY_PHASES,
  MAX_SLOTS_PER_HELLO,
  MAX_WORLDS_PER_HELLO,
  MEMBER_ADMISSIONS,
  PLATFORM_ARCH,
  PLATFORM_OS,
  ROOM_TLS,
  SLOT_STATES,
  TRUST_LEVELS,
  UPLOAD_KINDS,
} from '../protocol/protocol.constants';
import { ERROR_CODE_LIST } from '../protocol/error-rules.constants';
import {
  AP_VERSION_PATTERN,
  BASE64_PATTERN,
  CLIENT_ID_PATTERN,
  HTTPS_PATTERN,
  LOBBY_CODE_PATTERN,
  MODULE_PATTERN,
  PRINTABLE_PATTERN,
  SEMVER_PATTERN,
  SHA256_PATTERN,
  TOKEN_PATTERN,
} from './patterns.constants';

const SCHEMA_DEFS = {
  sha256: { type: 'string', pattern: SHA256_PATTERN },
  semver: { type: 'string', pattern: SEMVER_PATTERN, maxLength: 128 },
  apVersion: { type: 'string', pattern: AP_VERSION_PATTERN, maxLength: 32 },
  token: { type: 'string', pattern: TOKEN_PATTERN },
  lobbyCode: { type: 'string', pattern: LOBBY_CODE_PATTERN },
  clientId: { type: 'string', pattern: CLIENT_ID_PATTERN },
  moduleName: { type: 'string', pattern: MODULE_PATTERN },
  text16: { type: 'string', minLength: 1, maxLength: 16, pattern: PRINTABLE_PATTERN },
  text32: { type: 'string', minLength: 1, maxLength: 32, pattern: PRINTABLE_PATTERN },
  text64: { type: 'string', minLength: 1, maxLength: 64, pattern: PRINTABLE_PATTERN },
  text256: { type: 'string', minLength: 1, maxLength: 256, pattern: PRINTABLE_PATTERN },
  text2000: { type: 'string', minLength: 1, maxLength: 2000 },
  httpsUrl: { type: 'string', maxLength: 512, pattern: HTTPS_PATTERN },
  base64: { type: 'string', pattern: BASE64_PATTERN },
  seq: { type: 'integer', minimum: 1 },
  count: { type: 'integer', minimum: 0 },
  lobbyAdmission: { enum: LOBBY_ADMISSIONS },
  memberAdmission: { enum: MEMBER_ADMISSIONS },
  lobbyPhase: { enum: LOBBY_PHASES },
  trustLevel: { enum: TRUST_LEVELS },
  slotState: { enum: SLOT_STATES },
  uploadKind: { enum: UPLOAD_KINDS },
  protocolOffer: {
    type: 'object',
    required: ['name', 'versions'],
    properties: {
      name: { const: 'archipelia-lobby' },
      versions: { type: 'array', minItems: 1, maxItems: 16, items: { type: 'integer', minimum: 1 } },
    },
  },
  protocolPicked: {
    type: 'object',
    required: ['name', 'version'],
    properties: { name: { const: 'archipelia-lobby' }, version: { type: 'integer', minimum: 1 } },
  },
  engine: { type: 'object', required: ['ap'], properties: { ap: { $ref: '#/$defs/apVersion' } } },
  limits: {
    type: 'object',
    required: ['maxMessageBytes', 'chunkBytes', 'maxWorldBytes', 'maxYamlBytes', 'maxMemberBytes'],
    properties: {
      maxMessageBytes: { $ref: '#/$defs/count' },
      chunkBytes: { type: 'integer', minimum: 1 },
      maxWorldBytes: { $ref: '#/$defs/count' },
      maxYamlBytes: { $ref: '#/$defs/count' },
      maxMemberBytes: { $ref: '#/$defs/count' },
    },
  },
  serverInfo: {
    type: 'object',
    required: ['name', 'version'],
    properties: { name: { $ref: '#/$defs/text64' }, version: { $ref: '#/$defs/text64' } },
  },
  proof: {
    oneOf: [
      {
        type: 'object',
        required: ['method', 'bundle'],
        properties: { method: { const: 'github-attestation' }, bundle: { type: 'object' } },
      },
      { type: 'object', required: ['method'], properties: { method: { const: 'none' } } },
      {
        type: 'object',
        required: ['method', 'keyId', 'signature'],
        properties: {
          method: { const: 'ed25519' },
          keyId: { $ref: '#/$defs/text256' },
          signature: { $ref: '#/$defs/base64' },
        },
      },
    ],
  },
  worldEntry: {
    type: 'object',
    required: ['game', 'module', 'worldVersion', 'sha256', 'size'],
    properties: {
      game: { $ref: '#/$defs/text256' },
      module: { $ref: '#/$defs/moduleName' },
      worldVersion: { $ref: '#/$defs/semver' },
      sha256: { $ref: '#/$defs/sha256' },
      size: { type: 'integer', minimum: 1 },
      proof: { $ref: '#/$defs/proof' },
    },
  },
  slotEntry: {
    type: 'object',
    required: ['name', 'game', 'yaml'],
    properties: {
      name: { $ref: '#/$defs/text16' },
      game: { $ref: '#/$defs/text256' },
      yaml: {
        type: 'object',
        required: ['sha256', 'size'],
        properties: { sha256: { $ref: '#/$defs/sha256' }, size: { type: 'integer', minimum: 1 } },
      },
    },
  },
  slotList: { type: 'array', minItems: 1, maxItems: MAX_SLOTS_PER_HELLO, items: { $ref: '#/$defs/slotEntry' } },
  worldList: { type: 'array', maxItems: MAX_WORLDS_PER_HELLO, items: { $ref: '#/$defs/worldEntry' } },
  clientInfo: {
    type: 'object',
    required: ['id', 'name', 'version', 'platform'],
    properties: {
      id: { $ref: '#/$defs/clientId' },
      name: { $ref: '#/$defs/text64' },
      version: { $ref: '#/$defs/semver' },
      build: { $ref: '#/$defs/text64' },
      platform: {
        type: 'object',
        required: ['os', 'arch'],
        properties: { os: { enum: PLATFORM_OS }, arch: { enum: PLATFORM_ARCH } },
      },
      homepage: { $ref: '#/$defs/httpsUrl' },
      sdk: {
        type: 'object',
        required: ['name', 'version'],
        properties: { name: { $ref: '#/$defs/text64' }, version: { $ref: '#/$defs/text64' } },
      },
    },
  },
  roomTls: { enum: ROOM_TLS },
  errorCode: { enum: ERROR_CODE_LIST },
};

export { SCHEMA_DEFS };
