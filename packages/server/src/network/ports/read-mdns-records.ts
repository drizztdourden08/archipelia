/* @layer core @kind logic */
import type { MdnsRecord } from './network-ports.type';
import type { Wire } from './read-mdns-records.type';
import { MDNS_MAX_RECORDS } from './mdns-limits.constants';
import { readMdnsRecord } from './read-mdns-record';

const readMdnsRecords = (packet: { answers?: unknown; additionals?: unknown }): MdnsRecord[] =>
  [packet.answers, packet.additionals]
    .flatMap((list) => (Array.isArray(list) ? (list as Wire[]) : []))
    .slice(0, MDNS_MAX_RECORDS)
    .map(readMdnsRecord)
    .filter((record): record is MdnsRecord => record !== null);

export { readMdnsRecords };
