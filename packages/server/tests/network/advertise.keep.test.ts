/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { DiscoveryRecord } from '@drizztdourden08/archipelia-lobby-protocol';
import { BEACON_INTERVAL_MS, BEACON_PORT, parseBeacon, parseDiscoveryTxt } from '@drizztdourden08/archipelia-lobby-protocol';
import type { MdnsRecord } from '../../src/network';
import { startAdvertiser } from '../../src/network';
import { createFakeNetwork } from './fake-network';

const RECORD: DiscoveryRecord = { name: 'Friday seed server', id: 'srv_4f2a9c', protocol: 1, ap: '0.6.8', open: true };
const SERVICE = '_archipelia._tcp.local';

afterEach(() => {
  vi.useRealTimers();
});

const start = (net: ReturnType<typeof createFakeNetwork>, extra: { automation?: boolean; onError?: (error: Error) => void } = {}) =>
  startAdvertiser({ record: RECORD, port: 38290, automation: false, ports: net.ports, ...extra });

const typesOf = (records: MdnsRecord[]): string[] => records.map((record) => record.type);

const txtOf = (records: MdnsRecord[]): Record<string, string> => {
  const entries = records.flatMap((record) => (record.type === 'TXT' ? record.data : []));
  return Object.fromEntries(entries.map((entry) => [entry.slice(0, entry.indexOf('=')), entry.slice(entry.indexOf('=') + 1)]));
};

describe('the mDNS advertisement', () => {
  test('answers a service query with records that parse back to the record', async () => {
    const net = createFakeNetwork();
    const handle = await start(net);
    net.mdns().ask([{ name: SERVICE, type: 'PTR' }]);
    const answer = net.mdns().responses.at(-1) ?? [];
    expect(typesOf(answer)).toEqual(['PTR', 'SRV', 'TXT', 'A']);
    expect(answer.map((record) => record.data)).toContainEqual({ port: 38290, target: 'archipelia-srv_4f2a9c.local' });
    expect(answer.map((record) => record.data)).toContain('192.168.1.20');
    expect(parseDiscoveryTxt(txtOf(answer))).toEqual({ ok: true, record: RECORD, compatible: true });
    await handle.stop();
  });

  test('answers questions for the instance and the host, and ignores other services', async () => {
    const net = createFakeNetwork();
    await start(net);
    const mdns = net.mdns();
    const before = mdns.responses.length;
    mdns.ask([{ name: '_http._tcp.local', type: 'PTR' }]);
    expect(mdns.responses.length).toBe(before);
    mdns.ask([{ name: 'ARCHIPELIA-SRV_4F2A9C.local', type: 'A' }]);
    expect(typesOf(mdns.responses.at(-1) ?? [])).toEqual(['A']);
    mdns.ask([{ name: 'srv_4f2a9c._archipelia._tcp.local', type: 'TXT' }]);
    expect(typesOf(mdns.responses.at(-1) ?? [])).toEqual(['TXT']);
    mdns.ask([{ name: '_services._dns-sd._udp.local', type: 'PTR' }]);
    expect(mdns.responses.at(-1)).toMatchObject([{ type: 'PTR', data: SERVICE }]);
  });

  test('update announces the new record and stop says goodbye with a zero TTL', async () => {
    const net = createFakeNetwork();
    const handle = await start(net);
    handle.update({ ...RECORD, open: false });
    expect(txtOf(net.mdns().responses.at(-1) ?? []).open).toBe('0');
    await handle.stop();
    expect((net.mdns().responses.at(-1) ?? []).every((record) => record.ttl === 0)).toBe(true);
    expect(net.mdns().closed).toBe(true);
  });
});

describe('the beacon', () => {
  test('is sent at once to every broadcast address and on every interval', async () => {
    vi.useFakeTimers();
    const net = createFakeNetwork();
    const handle = await start(net);
    const socket = net.socket();
    expect(socket.options.broadcast).toBe(true);
    expect(socket.sent.map((sent) => sent.address)).toEqual(['192.168.1.255', '255.255.255.255']);
    expect(socket.sent.every((sent) => sent.port === BEACON_PORT)).toBe(true);
    const parsed = parseBeacon(socket.sent[0]?.data ?? '');
    expect(parsed.ok && parsed.record).toEqual({ ...RECORD, port: 38290 });
    vi.advanceTimersByTime(BEACON_INTERVAL_MS);
    expect(socket.sent.length).toBe(4);
    await handle.stop();
    vi.advanceTimersByTime(BEACON_INTERVAL_MS * 3);
    expect(socket.sent.length).toBe(4);
  });

  test('carries an update at once', async () => {
    const net = createFakeNetwork();
    const handle = await start(net);
    handle.update({ ...RECORD, open: false });
    const beacon = parseBeacon(net.socket().sent.at(-1)?.data ?? '');
    expect(beacon.ok && beacon.record.open).toBe(false);
    await handle.stop();
  });
});

describe('the advertiser lifecycle', () => {
  test('stop closes every socket and may be called twice', async () => {
    const net = createFakeNetwork();
    const handle = await start(net);
    expect(handle.active).toBe(true);
    await handle.stop();
    await handle.stop();
    expect(handle.active).toBe(false);
    expect(net.sockets.every((socket) => socket.closed)).toBe(true);
  });

  test('keeps the mDNS advertisement when the beacon port cannot open, and reports the error', async () => {
    const errors: string[] = [];
    const net = createFakeNetwork({ refuseUdp: () => true });
    const handle = await start(net, { onError: (error) => errors.push(error.message) });
    expect(handle.active).toBe(true);
    expect(errors).toEqual(['address in use']);
    await handle.stop();
  });

  test('automation opens nothing and returns a no-op handle', async () => {
    const net = createFakeNetwork();
    const handle = await start(net, { automation: true });
    handle.update(RECORD);
    await handle.stop();
    expect(handle.active).toBe(false);
    expect(net.sockets).toEqual([]);
    expect(net.mdnsPorts).toEqual([]);
  });
});
