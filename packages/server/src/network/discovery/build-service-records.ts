/* @layer core @kind logic */
import type { DiscoveryRecord } from '@drizztdourden08/archipelia-lobby-protocol';
import { buildDiscoveryTxt } from '@drizztdourden08/archipelia-lobby-protocol';
import type { MdnsRecord } from '../ports/network-ports.type';
import { hostFqdn } from './host-fqdn';
import { instanceFqdn } from './instance-fqdn';
import { PTR_TTL_SECONDS, RECORD_TTL_SECONDS, SERVICE_DOMAIN } from './network-discovery.constants';

const buildServiceRecords = (record: DiscoveryRecord, port: number, addresses: string[]): MdnsRecord[] => {
  const instance = instanceFqdn(record.id);
  const host = hostFqdn(record.id);
  const txt = Object.entries(buildDiscoveryTxt(record)).map(([key, value]) => `${key}=${value}`);
  return [
    { name: SERVICE_DOMAIN, type: 'PTR', ttl: PTR_TTL_SECONDS, flush: false, data: instance },
    { name: instance, type: 'SRV', ttl: RECORD_TTL_SECONDS, flush: true, data: { port, target: host } },
    { name: instance, type: 'TXT', ttl: RECORD_TTL_SECONDS, flush: true, data: txt },
    ...addresses.map((address): MdnsRecord => ({ name: host, type: 'A', ttl: RECORD_TTL_SECONDS, flush: true, data: address })),
  ];
};

export { buildServiceRecords };
