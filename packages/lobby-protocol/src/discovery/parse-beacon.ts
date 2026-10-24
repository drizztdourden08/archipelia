/* @layer protocol @kind logic */
import type { DiscoveryBeacon, DiscoveryParse } from './discovery.type';
import { isRecord } from '../validate/is-record';
import { BEACON_APP, BEACON_MAX_BYTES } from './discovery.constants';
import { DISCOVERY_BEACON_SCHEMA } from './discovery-schemas';
import { finishDiscovery } from './finish-discovery';

const readJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const parseBeacon = (datagram: string | Uint8Array): DiscoveryParse<DiscoveryBeacon> => {
  const bytes = typeof datagram === 'string' ? new TextEncoder().encode(datagram) : datagram;
  if (bytes.length > BEACON_MAX_BYTES) {
    return { ok: false, reason: 'too-large', detail: `the datagram is ${bytes.length} bytes` };
  }
  const value = readJson(new TextDecoder().decode(bytes));
  if (!isRecord(value)) {
    return { ok: false, reason: 'not-json', detail: 'the datagram is not a JSON object' };
  }
  if (value.app !== BEACON_APP) {
    return { ok: false, reason: 'wrong-app', detail: 'the datagram is not an Archipelia beacon' };
  }
  const outcome = finishDiscovery<DiscoveryBeacon>(DISCOVERY_BEACON_SCHEMA, value);
  if (!outcome.ok) return outcome;
  const { name, id, protocol, ap, open, port } = outcome.record;
  return { ok: true, record: { name, id, protocol, ap, open, port }, compatible: outcome.compatible };
};

export { parseBeacon };
