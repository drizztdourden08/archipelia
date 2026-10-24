/* @layer protocol @kind data */
import { SCHEMA_DEFS } from './schema-defs';

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const LOBBY_INFO_REPLY_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.info.reply',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'protocol', 'server', 'lobby', 'limits'],
  properties: {
    type: { const: 'lobby.info.reply' },
    re: { $ref: '#/$defs/seq' },
    protocol: { $ref: '#/$defs/protocolPicked' },
    server: { $ref: '#/$defs/serverInfo' },
    lobby: {
      type: 'object',
      required: ['name', 'engine', 'phase', 'joinable', 'admission', 'allowUnlisted', 'worlds', 'requires'],
      properties: {
        name: { $ref: '#/$defs/text256' },
        engine: { $ref: '#/$defs/engine' },
        phase: { $ref: '#/$defs/lobbyPhase' },
        joinable: { type: 'boolean' },
        admission: { $ref: '#/$defs/lobbyAdmission' },
        allowUnlisted: { type: 'boolean' },
        worlds: {
          type: 'array',
          maxItems: 64,
          items: {
            type: 'object',
            required: ['game', 'worldVersion'],
            properties: { game: { $ref: '#/$defs/text256' }, worldVersion: { $ref: '#/$defs/semver' } },
          },
        },
        requires: {
          type: 'object',
          required: ['capabilities'],
          properties: { capabilities: { type: 'array', maxItems: 32, items: { $ref: '#/$defs/text64' } } },
        },
      },
    },
    limits: { $ref: '#/$defs/limits' },
  },
};

const WELCOME_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/welcome',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'protocol', 'server', 'lobby', 'member', 'need', 'limits'],
  properties: {
    type: { const: 'welcome' },
    re: { $ref: '#/$defs/seq' },
    protocol: { $ref: '#/$defs/protocolPicked' },
    server: { $ref: '#/$defs/serverInfo' },
    lobby: {
      type: 'object',
      required: ['id', 'name', 'engine', 'admission', 'allowUnlisted', 'phase'],
      properties: {
        id: { $ref: '#/$defs/text64' },
        name: { $ref: '#/$defs/text256' },
        engine: { $ref: '#/$defs/engine' },
        admission: { $ref: '#/$defs/lobbyAdmission' },
        allowUnlisted: { type: 'boolean' },
        phase: { $ref: '#/$defs/lobbyPhase' },
      },
    },
    member: {
      type: 'object',
      required: ['id', 'token', 'admission', 'trust'],
      properties: {
        id: { $ref: '#/$defs/text64' },
        token: { $ref: '#/$defs/token' },
        admission: { $ref: '#/$defs/memberAdmission' },
        trust: { $ref: '#/$defs/trustLevel' },
        resumed: { type: 'boolean' },
      },
    },
    need: { type: 'array', maxItems: 64, items: { $ref: '#/$defs/sha256' } },
    limits: { $ref: '#/$defs/limits' },
  },
};

const ERROR_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/error',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'code', 'message', 'fatal'],
  properties: {
    type: { const: 'error' },
    re: { $ref: '#/$defs/seq' },
    code: { $ref: '#/$defs/errorCode' },
    message: { $ref: '#/$defs/text2000' },
    fatal: { type: 'boolean' },
    field: { $ref: '#/$defs/text256' },
    slot: { $ref: '#/$defs/text256' },
    retryAfter: { $ref: '#/$defs/count' },
    supported: { type: 'array', maxItems: 16, items: { type: 'integer', minimum: 1 } },
    lobbyAp: { $ref: '#/$defs/apVersion' },
  },
};

const ADMISSION_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/admission',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'state'],
  properties: {
    type: { const: 'admission' },
    state: { $ref: '#/$defs/memberAdmission' },
    reason: { $ref: '#/$defs/text256' },
  },
};

export { ADMISSION_SCHEMA, ERROR_SCHEMA, LOBBY_INFO_REPLY_SCHEMA, WELCOME_SCHEMA };
