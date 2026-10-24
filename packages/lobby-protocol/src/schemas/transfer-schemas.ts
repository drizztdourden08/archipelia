/* @layer protocol @kind data */
import { SCHEMA_DEFS } from './schema-defs';

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const SLOTS_OK_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/slots.ok',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'need'],
  properties: {
    type: { const: 'slots.ok' },
    re: { $ref: '#/$defs/seq' },
    need: { type: 'array', maxItems: 64, items: { $ref: '#/$defs/sha256' } },
  },
};

const UPLOAD_READY_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/upload.ready',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'sha256', 'offset'],
  properties: {
    type: { const: 'upload.ready' },
    re: { $ref: '#/$defs/seq' },
    sha256: { $ref: '#/$defs/sha256' },
    offset: { $ref: '#/$defs/count' },
  },
};

const UPLOAD_DONE_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/upload.done',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'sha256', 'ok'],
  properties: { type: { const: 'upload.done' }, sha256: { $ref: '#/$defs/sha256' }, ok: { type: 'boolean' } },
};

const FILE_CHUNK_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/file.chunk',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'fileId', 'offset', 'data'],
  properties: {
    type: { const: 'file.chunk' },
    re: { $ref: '#/$defs/seq' },
    fileId: { $ref: '#/$defs/text64' },
    offset: { $ref: '#/$defs/count' },
    data: { $ref: '#/$defs/base64' },
  },
};

const FILE_DONE_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/file.done',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'fileId', 'sha256'],
  properties: {
    type: { const: 'file.done' },
    re: { $ref: '#/$defs/seq' },
    fileId: { $ref: '#/$defs/text64' },
    sha256: { $ref: '#/$defs/sha256' },
  },
};

export { FILE_CHUNK_SCHEMA, FILE_DONE_SCHEMA, SLOTS_OK_SCHEMA, UPLOAD_DONE_SCHEMA, UPLOAD_READY_SCHEMA };
