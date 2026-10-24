/* @layer core @kind logic */
import type { DiscoverySource, LanServer } from './browse.type';
import type { ServerTableOptions, Sighting, TableEntry } from './server-table.type';
import { MAX_LAN_SERVERS } from './network-discovery.constants';

const createServerTable = ({ now, onChange }: ServerTableOptions) => {
  const entries = new Map<string, TableEntry>();
  let published = '[]';

  const sourcesOf = (entry: TableEntry): DiscoverySource[] =>
    (['mdns', 'beacon'] as const).filter((source) => (entry.expires[source] ?? 0) > now());

  const list = (): LanServer[] =>
    [...entries.values()]
      .map((entry): LanServer => ({ ...entry.record, host: entry.host, port: entry.port, compatible: entry.compatible, via: sourcesOf(entry) }))
      .filter((server) => server.via.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));

  const publish = () => {
    const servers = list();
    const text = JSON.stringify(servers);
    if (text === published) return;
    published = text;
    onChange?.(servers);
  };

  const seen = (source: DiscoverySource, sighting: Sighting, ttlMs: number) => {
    const id = sighting.record.id;
    const known = entries.get(id);
    if (!known && entries.size >= MAX_LAN_SERVERS) return;
    entries.set(id, { ...sighting, expires: { ...known?.expires, [source]: now() + ttlMs } });
    publish();
  };

  const forget = (source: DiscoverySource, id: string) => {
    const known = entries.get(id);
    if (!known) return;
    known.expires[source] = 0;
    publish();
  };

  const sweep = () => {
    for (const [id, entry] of entries) if (sourcesOf(entry).length === 0) entries.delete(id);
    publish();
  };

  return { seen, forget, sweep, list };
};

export { createServerTable };
