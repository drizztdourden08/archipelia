/* @layer core @kind logic */
import { isUsableAddress } from '../address/is-usable-address';
import { evictOldest } from './evict-oldest';
import { MAX_ADDRESSES, MAX_HOSTS } from './network-discovery.constants';

const createHostBook = () => {
  const hosts = new Map<string, string[]>();
  return {
    add: (name: string, address: string) => {
      if (!isUsableAddress(address)) return;
      evictOldest(hosts, MAX_HOSTS, name);
      const list = hosts.get(name) ?? [];
      if (!list.includes(address) && list.length < MAX_ADDRESSES) hosts.set(name, [...list, address]);
    },
    first: (name: string): string | undefined => hosts.get(name)?.[0],
  };
};

export { createHostBook };
