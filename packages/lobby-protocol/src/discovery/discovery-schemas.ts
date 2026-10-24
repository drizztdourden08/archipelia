/* @layer protocol @kind data */
import { SCHEMA_DEFS } from '../schemas/schema-defs';

const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const DISCOVERY_RECORD_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/discovery-record',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['name', 'id', 'protocol', 'ap', 'open'],
  properties: {
    name: { $ref: '#/$defs/text64' },
    id: { type: 'string', pattern: '^[A-Za-z0-9_-]{4,64}$' },
    protocol: { type: 'integer', minimum: 1 },
    ap: { $ref: '#/$defs/apVersion' },
    open: { type: 'boolean' },
  },
};

const DISCOVERY_BEACON_SCHEMA = {
  $schema: DRAFT,
  $id: 'archipelia-lobby/1/discovery-beacon',
  $defs: SCHEMA_DEFS,
  type: 'object',
  required: ['app', 'name', 'id', 'protocol', 'ap', 'open', 'port'],
  properties: {
    app: { const: 'archipelia' },
    name: { $ref: '#/$defs/text64' },
    id: { type: 'string', pattern: '^[A-Za-z0-9_-]{4,64}$' },
    protocol: { type: 'integer', minimum: 1 },
    ap: { $ref: '#/$defs/apVersion' },
    open: { type: 'boolean' },
    port: { type: 'integer', minimum: 1, maximum: 65535 },
  },
};

export { DISCOVERY_BEACON_SCHEMA, DISCOVERY_RECORD_SCHEMA };
