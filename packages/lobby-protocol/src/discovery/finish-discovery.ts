/* @layer protocol @kind logic */
import type { Schema } from '../validate/validate.type';
import type { DiscoveryParse, DiscoveryRecord } from './discovery.type';
import { SUPPORTED_PROTOCOL_VERSIONS } from '../protocol/protocol.constants';
import { validateSchema } from '../validate/validate-schema';

const finishDiscovery = <T extends DiscoveryRecord>(schema: Schema, candidate: unknown): DiscoveryParse<T> => {
  const problems = validateSchema(schema, candidate);
  const first = problems[0];
  if (first) return { ok: false, reason: 'malformed', detail: first.message };
  const record = candidate as T;
  return { ok: true, record, compatible: SUPPORTED_PROTOCOL_VERSIONS.includes(record.protocol) };
};

export { finishDiscovery };
