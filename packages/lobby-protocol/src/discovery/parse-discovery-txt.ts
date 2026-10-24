/* @layer protocol @kind logic */
import type { DiscoveryParse, DiscoveryRecord } from './discovery.type';
import { DISCOVERY_TXT_KEYS, DISCOVERY_TXT_VALUE_MAX_BYTES } from './discovery.constants';
import { DISCOVERY_RECORD_SCHEMA } from './discovery-schemas';
import { finishDiscovery } from './finish-discovery';
import { DIGITS } from './parse-discovery-txt.constants';

const typedRecord = (txt: Record<string, string | undefined>): Record<string, unknown> => {
  const protocol = txt[DISCOVERY_TXT_KEYS.protocol];
  const open = txt[DISCOVERY_TXT_KEYS.open];
  return {
    name: txt[DISCOVERY_TXT_KEYS.name],
    id: txt[DISCOVERY_TXT_KEYS.id],
    protocol: protocol !== undefined && DIGITS.test(protocol) ? Number(protocol) : protocol,
    ap: txt[DISCOVERY_TXT_KEYS.ap],
    open: open === '1' || (open === '0' ? false : open),
  };
};

const tooLong = (txt: Record<string, string | undefined>): string | null => {
  const encoder = new TextEncoder();
  for (const [key, value] of Object.entries(txt)) {
    if (value !== undefined && encoder.encode(value).length > DISCOVERY_TXT_VALUE_MAX_BYTES) return key;
  }
  return null;
};

const parseDiscoveryTxt = (txt: Record<string, string | undefined>): DiscoveryParse<DiscoveryRecord> => {
  const long = tooLong(txt);
  if (long !== null) return { ok: false, reason: 'too-large', detail: `the TXT value ${long} is too long` };
  return finishDiscovery(DISCOVERY_RECORD_SCHEMA, typedRecord(txt));
};

export { parseDiscoveryTxt };
