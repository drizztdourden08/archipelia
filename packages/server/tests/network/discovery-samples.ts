/* @layer tests @kind test */
import type { DiscoveryRecord } from '@drizztdourden08/archipelia-lobby-protocol';
import { buildBeacon } from '@drizztdourden08/archipelia-lobby-protocol';
import type { MdnsRecord } from '../../src/network';

const RECORD: DiscoveryRecord = { name: 'Friday seed server', id: 'srv_4f2a9c', protocol: 1, ap: '0.6.8', open: true };
const INSTANCE = 'srv_4f2a9c._archipelia._tcp.local';
const HOST = 'archipelia-srv_4f2a9c.local';

type AnnouncementOptions = { ttl?: number; port?: number; txt?: string[] };

const announcement = ({ ttl, port, txt }: AnnouncementOptions = {}): MdnsRecord[] => [
  { name: '_archipelia._tcp.local', type: 'PTR', ttl: ttl ?? 4500, flush: false, data: INSTANCE },
  { name: INSTANCE, type: 'SRV', ttl: ttl ?? 120, flush: true, data: { port: port ?? 38290, target: HOST } },
  {
    name: INSTANCE,
    type: 'TXT',
    ttl: ttl ?? 120,
    flush: true,
    data: txt ?? ['name=Friday seed server', 'id=srv_4f2a9c', 'proto=1', 'ap=0.6.8', 'open=1'],
  },
  { name: HOST, type: 'A', ttl: 120, flush: true, data: '192.168.1.50' },
];

const beaconBytes = (overrides: Partial<DiscoveryRecord & { port: number }> = {}): string =>
  buildBeacon({ ...RECORD, port: 38290, ...overrides });

export { announcement, beaconBytes, RECORD };
