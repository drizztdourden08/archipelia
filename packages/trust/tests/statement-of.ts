/* @layer tests @kind helper */
import { createHash } from 'node:crypto';

const statementOf = (bytes: Uint8Array, predicateType = 'https://slsa.dev/provenance/v1') => ({
  _type: 'https://in-toto.io/Statement/v1',
  subject: [{ name: 'relic_of_the_past.apworld', digest: { sha256: createHash('sha256').update(bytes).digest('hex') } }],
  predicateType,
  predicate: {},
});

export { statementOf };
