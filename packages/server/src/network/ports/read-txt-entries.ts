/* @layer core @kind logic */
import { MDNS_MAX_TXT_BYTES, MDNS_MAX_TXT_ENTRIES } from './mdns-limits.constants';
import { readMdnsText } from './read-mdns-text';

const readTxtEntries = (data: unknown): string[] =>
  (Array.isArray(data) ? data : [data])
    .slice(0, MDNS_MAX_TXT_ENTRIES)
    .map(readMdnsText)
    .filter((text): text is string => text !== null && Buffer.byteLength(text) <= MDNS_MAX_TXT_BYTES);

export { readTxtEntries };
