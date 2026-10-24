/* @layer core @kind types */
import type { DiscoveryBeacon, DiscoveryRecord } from '@drizztdourden08/archipelia-lobby-protocol';
import type { MdnsRecord, NetworkPorts } from '../ports/network-ports.type';

type AdvertiseOptions = {
  record: DiscoveryRecord;
  port: number;
  automation: boolean;
  ports: NetworkPorts;
  intervalMs?: number;
  onError?: (error: Error) => void;
};

type AdvertiseHandle = {
  active: boolean;
  update: (record: DiscoveryRecord) => void;
  stop: () => Promise<void>;
};

type BeaconSenderOptions = {
  ports: NetworkPorts;
  current: () => DiscoveryBeacon;
  intervalMs?: number;
  onError?: (error: Error) => void;
};

type MdnsAdvertiserOptions = {
  ports: NetworkPorts;
  records: () => MdnsRecord[];
  repeatMs?: number;
  onError?: (error: Error) => void;
};

export type { AdvertiseHandle, AdvertiseOptions, BeaconSenderOptions, MdnsAdvertiserOptions };
