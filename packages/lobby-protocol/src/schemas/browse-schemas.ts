/* @layer protocol @kind data */
import { LOBBY_BROWSE_MAX } from '../protocol/protocol.constants';
import { SCHEMA_DEFS } from './schema-defs';

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const LOBBY_BROWSE_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.browse',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'protocol'],
  properties: {
    type: { const: 'lobby.browse' },
    seq: { $ref: '#/$defs/seq' },
    protocol: { $ref: '#/$defs/protocolOffer' },
  },
};

const LOBBY_BROWSE_REPLY_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/lobby.browse.reply',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['type', 'protocol', 'server', 'lobbies'],
  properties: {
    type: { const: 'lobby.browse.reply' },
    re: { $ref: '#/$defs/seq' },
    protocol: { $ref: '#/$defs/protocolPicked' },
    server: { $ref: '#/$defs/serverInfo' },
    lobbies: {
      type: 'array',
      maxItems: LOBBY_BROWSE_MAX,
      items: {
        type: 'object',
        required: ['name', 'joinToken', 'engine', 'admission', 'allowUnlisted', 'joinable', 'seats'],
        properties: {
          name: { $ref: '#/$defs/text256' },
          joinToken: { $ref: '#/$defs/token' },
          engine: { $ref: '#/$defs/engine' },
          admission: { $ref: '#/$defs/lobbyAdmission' },
          allowUnlisted: { type: 'boolean' },
          joinable: { type: 'boolean' },
          seats: { $ref: '#/$defs/openSeats' },
        },
      },
    },
  },
};

export { LOBBY_BROWSE_REPLY_SCHEMA, LOBBY_BROWSE_SCHEMA };
