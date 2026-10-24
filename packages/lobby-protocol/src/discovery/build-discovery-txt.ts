/* @layer protocol @kind logic */
import type { DiscoveryRecord } from './discovery.type';
import { DISCOVERY_TXT_KEYS } from './discovery.constants';

const buildDiscoveryTxt = (record: DiscoveryRecord): Record<string, string> => ({
  [DISCOVERY_TXT_KEYS.name]: record.name,
  [DISCOVERY_TXT_KEYS.id]: record.id,
  [DISCOVERY_TXT_KEYS.protocol]: String(record.protocol),
  [DISCOVERY_TXT_KEYS.ap]: record.ap,
  [DISCOVERY_TXT_KEYS.open]: record.open ? '1' : '0',
});

export { buildDiscoveryTxt };
