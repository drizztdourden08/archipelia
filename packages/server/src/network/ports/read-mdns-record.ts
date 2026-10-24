/* @layer core @kind logic */
import type { MdnsRecord } from './network-ports.type';
import type { Wire } from './read-mdns-records.type';
import { MDNS_MAX_NAME } from './mdns-limits.constants';
import { readSrvData } from './read-srv-data';
import { readTxtEntries } from './read-txt-entries';

const readData = (type: unknown, data: unknown): MdnsRecord['data'] | null => {
  switch (type) {
    case 'PTR':
      return typeof data === 'string' && data.length <= MDNS_MAX_NAME ? data : null;
    case 'A':
      return typeof data === 'string' ? data : null;
    case 'TXT':
      return readTxtEntries(data);
    case 'SRV':
      return readSrvData(data);
    default:
      return null;
  }
};

const readMdnsRecord = ({ name, type, ttl, flush, data }: Wire): MdnsRecord | null => {
  if (typeof name !== 'string' || name.length > MDNS_MAX_NAME) return null;
  const value = readData(type, data);
  if (value === null) return null;
  return { name, type, ttl: typeof ttl === 'number' ? ttl : 0, flush: flush === true, data: value } as MdnsRecord;
};

export { readMdnsRecord };
