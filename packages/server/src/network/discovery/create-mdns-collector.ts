/* @layer core @kind logic */
import type { MdnsRecord } from '../ports/network-ports.type';
import type { MdnsEvent } from './mdns-collector.type';
import { isUsableAddress } from '../address/is-usable-address';
import { createHostBook } from './create-host-book';
import { createInstanceBook } from './create-instance-book';
import { INSTANCE_SUFFIX, SERVICE_DOMAIN } from './network-discovery.constants';
import { resolveInstance } from './resolve-instance';

const isInstance = (name: string): boolean => name.endsWith(INSTANCE_SUFFIX) && name.length > INSTANCE_SUFFIX.length;

const instanceOf = (record: MdnsRecord): string => {
  const name = record.name.toLowerCase();
  return record.type === 'PTR' && name === SERVICE_DOMAIN ? record.data.toLowerCase() : name;
};

const createMdnsCollector = () => {
  const instances = createInstanceBook();
  const hosts = createHostBook();

  const take = (record: MdnsRecord, events: MdnsEvent[]): string | null => {
    if (record.type === 'A') {
      hosts.add(record.name.toLowerCase(), record.data);
      return null;
    }
    const instance = instanceOf(record);
    if (!isInstance(instance)) return null;
    if (record.ttl === 0) {
      const id = instances.forget(instance);
      if (id !== undefined) events.push({ kind: 'gone', id });
      return null;
    }
    const entry = instances.slot(instance);
    if (record.type === 'SRV') entry.srv = { ...record.data, ttl: record.ttl };
    if (record.type === 'TXT') entry.txt = { entries: record.data, ttl: record.ttl };
    return instance;
  };

  const resolve = (instance: string, from: string): MdnsEvent | null => {
    const entry = instances.get(instance);
    if (!entry?.srv) return null;
    const found = resolveInstance(entry, hosts.first(entry.srv.target.toLowerCase()) ?? (isUsableAddress(from) ? from : null));
    if (found) entry.id = found.parsed.record.id;
    return found;
  };

  const collect = (records: MdnsRecord[], from: string): MdnsEvent[] => {
    const events: MdnsEvent[] = [];
    const touched = new Set<string>();
    for (const record of records) {
      const instance = take(record, events);
      if (instance !== null) touched.add(instance);
    }
    for (const instance of touched) {
      const found = resolve(instance, from);
      if (found) events.push(found);
    }
    return events;
  };

  return { collect };
};

export { createMdnsCollector };
