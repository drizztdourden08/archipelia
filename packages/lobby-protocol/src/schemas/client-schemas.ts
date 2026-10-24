/* @layer protocol @kind data */
import { SCHEMA_DEFS } from './schema-defs';

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const LOBBY_INFO_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.info',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'protocol', 'lobby'],
  properties: {
    type: { const: 'lobby.info' },
    seq: { $ref: '#/$defs/seq' },
    protocol: { $ref: '#/$defs/protocolOffer' },
    lobby: { type: 'object', required: ['code'], properties: { code: { $ref: '#/$defs/lobbyCode' } } },
  },
};

const HELLO_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/hello',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'protocol', 'lobby', 'client', 'player', 'archipelago', 'capabilities', 'worlds', 'slots'],
  properties: {
    type: { const: 'hello' },
    seq: { $ref: '#/$defs/seq' },
    protocol: { $ref: '#/$defs/protocolOffer' },
    lobby: { type: 'object', required: ['code'], properties: { code: { $ref: '#/$defs/lobbyCode' } } },
    resume: { type: ['string', 'null'], pattern: '^[A-Za-z0-9_-]{43}$' },
    client: { $ref: '#/$defs/clientInfo' },
    player: { type: 'object', required: ['displayName'], properties: { displayName: { $ref: '#/$defs/text32' } } },
    archipelago: {
      type: 'object',
      required: ['version'],
      properties: { version: { $ref: '#/$defs/apVersion' } },
    },
    capabilities: { type: 'array', maxItems: 32, items: { $ref: '#/$defs/text64' } },
    worlds: { $ref: '#/$defs/worldList' },
    slots: { $ref: '#/$defs/slotList' },
  },
};

const READY_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/ready',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'ready'],
  properties: { type: { const: 'ready' }, seq: { $ref: '#/$defs/seq' }, ready: { type: 'boolean' } },
};

const LEAVE_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/leave',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type'],
  properties: { type: { const: 'leave' }, seq: { $ref: '#/$defs/seq' } },
};

const SLOTS_SET_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/slots.set',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'slots', 'worlds'],
  properties: {
    type: { const: 'slots.set' },
    seq: { $ref: '#/$defs/seq' },
    slots: { $ref: '#/$defs/slotList' },
    worlds: { $ref: '#/$defs/worldList' },
  },
};

const UPLOAD_BEGIN_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/upload.begin',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'sha256', 'kind', 'size'],
  properties: {
    type: { const: 'upload.begin' },
    seq: { $ref: '#/$defs/seq' },
    sha256: { $ref: '#/$defs/sha256' },
    kind: { $ref: '#/$defs/uploadKind' },
    size: { type: 'integer', minimum: 1 },
  },
};

const UPLOAD_CHUNK_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/upload.chunk',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'sha256', 'offset', 'data'],
  properties: {
    type: { const: 'upload.chunk' },
    sha256: { $ref: '#/$defs/sha256' },
    offset: { $ref: '#/$defs/count' },
    data: { $ref: '#/$defs/base64' },
  },
};

const FILE_GET_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/file.get',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'fileId'],
  properties: { type: { const: 'file.get' }, seq: { $ref: '#/$defs/seq' }, fileId: { $ref: '#/$defs/text64' } },
};

export {
  FILE_GET_SCHEMA,
  HELLO_SCHEMA,
  LEAVE_SCHEMA,
  LOBBY_INFO_SCHEMA,
  READY_SCHEMA,
  SLOTS_SET_SCHEMA,
  UPLOAD_BEGIN_SCHEMA,
  UPLOAD_CHUNK_SCHEMA,
};
