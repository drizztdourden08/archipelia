/* @layer protocol @kind data */
import { SCHEMA_DEFS } from './schema-defs';

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const LOBBY_STATE_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.state',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'rev', 'phase', 'engine', 'members'],
  properties: {
    type: { const: 'lobby.state' },
    rev: { $ref: '#/$defs/count' },
    phase: { $ref: '#/$defs/lobbyPhase' },
    engine: { $ref: '#/$defs/engine' },
    members: {
      type: 'array',
      maxItems: 256,
      items: {
        type: 'object',
        required: ['id', 'displayName', 'client', 'trust', 'admission', 'ready', 'slots'],
        properties: {
          id: { $ref: '#/$defs/text64' },
          displayName: { $ref: '#/$defs/text32' },
          client: {
            type: 'object',
            required: ['name', 'version'],
            properties: { name: { $ref: '#/$defs/text64' }, version: { $ref: '#/$defs/semver' } },
          },
          trust: { $ref: '#/$defs/trustLevel' },
          admission: { $ref: '#/$defs/memberAdmission' },
          ready: { type: 'boolean' },
          slots: {
            type: 'array',
            maxItems: 8,
            items: {
              type: 'object',
              required: ['name', 'game', 'state'],
              properties: {
                name: { $ref: '#/$defs/text16' },
                game: { $ref: '#/$defs/text256' },
                state: { $ref: '#/$defs/slotState' },
                reason: { $ref: '#/$defs/text256' },
              },
            },
          },
        },
      },
    },
    others: {
      type: 'object',
      required: ['approved', 'pending'],
      properties: { approved: { $ref: '#/$defs/count' }, pending: { $ref: '#/$defs/count' } },
    },
  },
};

const LOBBY_PROGRESS_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.progress',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'phase', 'step', 'fraction'],
  properties: {
    type: { const: 'lobby.progress' },
    phase: { $ref: '#/$defs/lobbyPhase' },
    step: { $ref: '#/$defs/text64' },
    fraction: { type: 'number', minimum: 0, maximum: 1 },
  },
};

const LOBBY_STARTED_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.started',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'seed', 'engine', 'room', 'slots'],
  properties: {
    type: { const: 'lobby.started' },
    seed: { $ref: '#/$defs/text64' },
    engine: { $ref: '#/$defs/engine' },
    room: {
      type: 'object',
      required: ['address', 'host', 'port', 'tls'],
      properties: {
        address: { $ref: '#/$defs/text256' },
        host: { $ref: '#/$defs/text256' },
        port: { type: 'integer', minimum: 1, maximum: 65535 },
        tls: { $ref: '#/$defs/roomTls' },
        password: { $ref: '#/$defs/text256' },
        roomUrl: { $ref: '#/$defs/text256' },
      },
    },
    slots: {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        required: ['name', 'game', 'team', 'files'],
        properties: {
          name: { $ref: '#/$defs/text16' },
          game: { $ref: '#/$defs/text256' },
          team: { $ref: '#/$defs/count' },
          files: {
            type: 'array',
            maxItems: 16,
            items: {
              type: 'object',
              required: ['fileId', 'name', 'size', 'sha256'],
              properties: {
                fileId: { $ref: '#/$defs/text64' },
                name: { $ref: '#/$defs/text256' },
                size: { $ref: '#/$defs/count' },
                sha256: { $ref: '#/$defs/sha256' },
              },
            },
          },
        },
      },
    },
  },
};

const LOBBY_FAILED_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.failed',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'stage', 'message'],
  properties: {
    type: { const: 'lobby.failed' },
    stage: { $ref: '#/$defs/text64' },
    message: { $ref: '#/$defs/text2000' },
  },
};

const ROOM_STATUS_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/room.status',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'state'],
  properties: {
    type: { const: 'room.status' },
    state: { enum: ['hosting', 'stopped'] },
    address: { $ref: '#/$defs/text256' },
  },
};

export {
  LOBBY_FAILED_SCHEMA,
  LOBBY_PROGRESS_SCHEMA,
  LOBBY_STARTED_SCHEMA,
  LOBBY_STATE_SCHEMA,
  ROOM_STATUS_SCHEMA,
};
