/* @layer core @kind types */
import type { DiscoveryRecord } from '@archipelia/lobby-protocol';
import type { NetworkPorts } from '../ports/network-ports.type';

type DiscoverySource = 'mdns' | 'beacon';

type LanServer = DiscoveryRecord & {
  host: string;
  port: number;
  compatible: boolean;
  via: DiscoverySource[];
};

type BrowseOptions = {
  ports: NetworkPorts;
  automation: boolean;
  onChange?: (servers: LanServer[]) => void;
  onError?: (source: DiscoverySource, error: Error) => void;
  now?: () => number;
};

type BrowseHandle = {
  active: boolean;
  list: () => LanServer[];
  refresh: () => void;
  stop: () => Promise<void>;
};

export type { BrowseHandle, BrowseOptions, DiscoverySource, LanServer };
