/* @layer core @kind logic */
import type { PendingInstance } from './mdns-collector.type';
import { evictOldest } from './evict-oldest';
import { MAX_PENDING_INSTANCES } from './network-discovery.constants';

const createInstanceBook = () => {
  const pending = new Map<string, PendingInstance>();
  return {
    slot: (name: string): PendingInstance => {
      const found = pending.get(name);
      if (found) return found;
      evictOldest(pending, MAX_PENDING_INSTANCES, name);
      const created: PendingInstance = {};
      pending.set(name, created);
      return created;
    },
    get: (name: string): PendingInstance | undefined => pending.get(name),
    forget: (name: string): string | undefined => {
      const id = pending.get(name)?.id;
      pending.delete(name);
      return id;
    },
  };
};

export { createInstanceBook };
