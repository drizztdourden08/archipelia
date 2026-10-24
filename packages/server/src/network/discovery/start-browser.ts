/* @layer core @kind logic */
import { BEACON_EXPIRY_MS, BEACON_PORT, parseBeacon } from '@archipelia/lobby-protocol';
import type { BrowseHandle, BrowseOptions } from './browse.type';
import { BROWSE_QUERY_MS, MS, SERVICE_DOMAIN, SWEEP_MS } from './network-discovery.constants';
import { createMdnsCollector } from './create-mdns-collector';
import { createServerTable } from './create-server-table';
import { isUsableAddress } from '../address/is-usable-address';
import { noOpBrowser } from './no-op-browser';


const asError = (error: unknown): Error => (error instanceof Error ? error : new Error(String(error)));

const startBrowser = async ({ ports, automation, onChange, onError, now = Date.now }: BrowseOptions): Promise<BrowseHandle> => {
  if (automation) return noOpBrowser();
  const table = createServerTable({ now, onChange });
  const stops: Array<() => Promise<void>> = [];
  const refreshers: Array<() => void> = [];

  try {
    const mdns = ports.openMdns();
    const collector = createMdnsCollector();
    mdns.onError((error) => onError?.('mdns', error));
    mdns.onRecords((records, from) => {
      for (const event of collector.collect(records, from)) {
        if (event.kind === 'gone') table.forget('mdns', event.id);
        else table.seen('mdns', { record: event.parsed.record, host: event.host, port: event.port, compatible: event.parsed.compatible }, event.ttlSeconds * MS);
      }
    });
    const ask = () => mdns.query(SERVICE_DOMAIN);
    ask();
    const timer = setInterval(ask, BROWSE_QUERY_MS);
    timer.unref();
    refreshers.push(ask);
    stops.push(async () => {
      clearInterval(timer);
      await mdns.close();
    });
  } catch (error) {
    onError?.('mdns', asError(error));
  }

  try {
    const endpoint = await ports.openUdp({
      port: BEACON_PORT,
      onError: (error) => onError?.('beacon', error),
      onMessage: (data, from) => {
        const parsed = parseBeacon(data);
        if (!parsed.ok || !isUsableAddress(from.address)) return;
        const { port, ...record } = parsed.record;
        table.seen('beacon', { record, host: from.address, port, compatible: parsed.compatible }, BEACON_EXPIRY_MS);
      },
    });
    stops.push(() => endpoint.close());
  } catch (error) {
    onError?.('beacon', asError(error));
  }

  const sweeper = setInterval(table.sweep, SWEEP_MS);
  sweeper.unref();
  const handle: BrowseHandle = {
    active: stops.length > 0,
    list: table.list,
    refresh: () => {
      for (const run of refreshers) run();
    },
    stop: async () => {
      handle.active = false;
      clearInterval(sweeper);
      refreshers.length = 0;
      await Promise.all(stops.splice(0).map((stop) => stop()));
    },
  };
  return handle;
};

export { startBrowser };
