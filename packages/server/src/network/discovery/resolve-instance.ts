/* @layer core @kind logic */
import { parseDiscoveryTxt } from '@drizztdourden08/archipelia-lobby-protocol';
import type { MdnsFound, PendingInstance } from './mdns-collector.type';
import { MAX_PORT } from './network-discovery.constants';
import { parseTxtEntries } from './parse-txt-entries';

const resolveInstance = ({ srv, txt }: PendingInstance, host: string | null): MdnsFound | null => {
  if (!srv || !txt || host === null || !Number.isInteger(srv.port) || srv.port < 1 || srv.port > MAX_PORT) return null;
  const parsed = parseDiscoveryTxt(parseTxtEntries(txt.entries));
  if (!parsed.ok) return null;
  return { kind: 'found', parsed, host, port: srv.port, ttlSeconds: Math.min(srv.ttl, txt.ttl) };
};

export { resolveInstance };
