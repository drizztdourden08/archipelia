/* @layer core @kind logic */
import type { DiscoveryRecord } from '@archipelia/lobby-protocol';
import type { AdvertiseHandle, AdvertiseOptions } from './advertise.type';
import { buildServiceRecords } from './build-service-records';
import { noOpAdvertiser } from './no-op-advertiser';
import { startBeaconSender } from './start-beacon-sender';
import { startMdnsAdvertiser } from './start-mdns-advertiser';

const asError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)));

const startAdvertiser = async (options: AdvertiseOptions): Promise<AdvertiseHandle> => {
  const { port, automation, ports, intervalMs, onError } = options;
  if (automation) return noOpAdvertiser();
  let record: DiscoveryRecord = options.record;
  const addresses = () => ports.interfaces().map((entry) => entry.address);

  const stops: Array<() => Promise<void>> = [];
  const refresh: Array<() => void> = [];

  try {
    const mdns = startMdnsAdvertiser({ ports, records: () => buildServiceRecords(record, port, addresses()), onError });
    stops.push(mdns.stop);
    refresh.push(mdns.announce);
  } catch (error) {
    onError?.(asError(error));
  }
  try {
    const beacon = await startBeaconSender({ ports, current: () => ({ ...record, port }), intervalMs, onError });
    stops.push(beacon.stop);
    refresh.push(beacon.send);
  } catch (error) {
    onError?.(asError(error));
  }

  const handle: AdvertiseHandle = {
    active: stops.length > 0,
    update: (next) => {
      record = next;
      for (const run of refresh) run();
    },
    stop: async () => {
      handle.active = false;
      refresh.length = 0;
      await Promise.all(stops.splice(0).map((stop) => stop()));
    },
  };
  return handle;
};

export { startAdvertiser };
