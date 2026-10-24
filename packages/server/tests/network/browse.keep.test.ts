/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { BEACON_EXPIRY_MS, buildBeacon } from '@archipelia/lobby-protocol';
import type { LanServer } from '../../src/network';
import { startAdvertiser, startBrowser } from '../../src/network';
import { announcement, beaconBytes, RECORD } from './discovery-samples';
import { createFakeNetwork } from './fake-network';

afterEach(() => {
  vi.useRealTimers();
});

const open = async (extra: { onChange?: (list: LanServer[]) => void; refuse?: boolean } = {}) => {
  const net = createFakeNetwork({ refuseUdp: extra.refuse ? () => true : undefined });
  const browser = await startBrowser({ ports: net.ports, automation: false, onChange: extra.onChange });
  return { net, browser };
};

describe('listing servers', () => {
  test('lists a server heard over mDNS and tells the listener', async () => {
    const changes: number[] = [];
    const { net, browser } = await open({ onChange: (list) => changes.push(list.length) });
    expect(net.mdns().queries).toEqual(['_archipelia._tcp.local']);
    net.mdns().hear(announcement(), '192.168.1.50');
    expect(browser.list()).toEqual([{ ...RECORD, host: '192.168.1.50', port: 38290, compatible: true, via: ['mdns'] }]);
    expect(changes).toEqual([1]);
    await browser.stop();
  });

  test('round trips the advertiser output through the browser', async () => {
    const advertiserNet = createFakeNetwork();
    await startAdvertiser({ record: RECORD, port: 38290, automation: false, ports: advertiserNet.ports });
    const { net, browser } = await open();
    net.mdns().hear(advertiserNet.mdns().responses[0] ?? [], '192.168.1.99');
    expect(browser.list()[0]).toMatchObject({ ...RECORD, host: '192.168.1.20', port: 38290 });
    await browser.stop();
  });

  test('uses the sender address when no A record came', async () => {
    const { net, browser } = await open();
    net.mdns().hear(announcement().slice(0, 3), '192.168.1.77');
    expect(browser.list()[0]?.host).toBe('192.168.1.77');
    await browser.stop();
  });

  test('lists a server heard over the beacon port, even one that needs a newer protocol', async () => {
    const { net, browser } = await open();
    net.socket().deliver(beaconBytes(), { address: '192.168.1.60', port: 51000 });
    net.socket().deliver(beaconBytes({ id: 'srv_new', protocol: 9 }), { address: '192.168.1.61', port: 51000 });
    expect(browser.list().map((server) => [server.id, server.host, server.compatible])).toEqual([
      ['srv_4f2a9c', '192.168.1.60', true],
      ['srv_new', '192.168.1.61', false],
    ]);
    await browser.stop();
  });
});

describe('deduplication and expiry', () => {
  test('dedupes by server id across both sources', async () => {
    const { net, browser } = await open();
    net.mdns().hear(announcement(), '192.168.1.50');
    net.socket().deliver(beaconBytes(), { address: '192.168.1.50', port: 51000 });
    net.socket().deliver(beaconBytes(), { address: '192.168.1.50', port: 51000 });
    expect(browser.list()).toHaveLength(1);
    expect(browser.list()[0]?.via).toEqual(['mdns', 'beacon']);
    await browser.stop();
  });

  test('removes an mDNS server on goodbye and keeps a beacon sighting of it', async () => {
    const { net, browser } = await open();
    net.mdns().hear(announcement(), '192.168.1.50');
    net.socket().deliver(beaconBytes(), { address: '192.168.1.50', port: 51000 });
    net.mdns().hear(announcement({ ttl: 0 }), '192.168.1.50');
    expect(browser.list().map((server) => server.via)).toEqual([['beacon']]);
    await browser.stop();
  });

  test('forgets a beacon server after the expiry and tells the listener', async () => {
    vi.useFakeTimers();
    const sizes: number[] = [];
    const { net, browser } = await open({ onChange: (list) => sizes.push(list.length) });
    net.socket().deliver(beaconBytes(), { address: '192.168.1.60', port: 51000 });
    vi.advanceTimersByTime(BEACON_EXPIRY_MS - 1);
    expect(browser.list()).toHaveLength(1);
    vi.advanceTimersByTime(6000);
    expect(browser.list()).toEqual([]);
    expect(sizes).toEqual([1, 0]);
    await browser.stop();
  });
});

describe('hostile input', () => {
  test('ignores hostile beacon datagrams', async () => {
    const { net, browser } = await open();
    const from = { address: '192.168.1.66', port: 40000 };
    const hostile: Array<Uint8Array | string> = [
      'x'.repeat(5000),
      'not json at all',
      '[1,2,3]',
      'null',
      '{"app":"other","name":"x"}',
      '{"app":"archipelia"}',
      beaconBytes({ port: 0 }),
      beaconBytes({ port: 70000 }),
      beaconBytes({ id: 'bad id' }),
      JSON.stringify({ ...JSON.parse(buildBeacon({ ...RECORD, port: 1 })), name: 42 }),
      new Uint8Array([0xff, 0xfe, 0x00, 0x7b]),
      new Uint8Array(0),
    ];
    for (const datagram of hostile) net.socket().deliver(datagram, from);
    net.socket().deliver(beaconBytes(), { address: '0.0.0.0', port: 1 });
    net.socket().deliver(beaconBytes(), { address: '239.1.1.1', port: 1 });
    expect(browser.list()).toEqual([]);
    await browser.stop();
  });

  test('ignores hostile mDNS records', async () => {
    const { net, browser } = await open();
    net.mdns().hear(announcement({ port: 0 }), '192.168.1.50');
    net.mdns().hear(announcement({ port: 99999 }), '192.168.1.50');
    net.mdns().hear(announcement({ txt: ['name=x'] }), '192.168.1.50');
    net.mdns().hear(announcement({ txt: ['garbage', '=novalue', 'id=a', 'proto=one'] }), '192.168.1.50');
    net.mdns().hear([{ name: 'evil._other._tcp.local', type: 'SRV', ttl: 120, flush: true, data: { port: 1, target: 'x.local' } }], '192.168.1.5');
    expect(browser.list()).toEqual([]);
    await browser.stop();
  });

  test('does not list a server whose host cannot be known', async () => {
    const { net, browser } = await open();
    net.mdns().hear(announcement().slice(1, 3), '0.0.0.0');
    expect(browser.list()).toEqual([]);
    await browser.stop();
  });

  test('bounds the table when a host floods it with ids', async () => {
    const { net, browser } = await open();
    for (let index = 0; index < 400; index += 1) {
      net.socket().deliver(beaconBytes({ id: `flood${index}` }), { address: '192.168.1.66', port: 40000 });
    }
    expect(browser.list()).toHaveLength(256);
    await browser.stop();
  });
});

describe('the browser lifecycle', () => {
  test('survives a failed beacon bind and reports it', async () => {
    const errors: string[] = [];
    const net = createFakeNetwork({ refuseUdp: () => true });
    const browser = await startBrowser({ ports: net.ports, automation: false, onError: (source) => errors.push(source) });
    net.mdns().hear(announcement(), '192.168.1.50');
    expect(browser.list()).toHaveLength(1);
    net.mdns().fail(new Error('multicast down'));
    expect(errors).toEqual(['beacon', 'mdns']);
    await browser.stop();
  });

  test('refresh asks again, the interval repeats, and stop closes every socket', async () => {
    vi.useFakeTimers();
    const { net, browser } = await open();
    browser.refresh();
    vi.advanceTimersByTime(30000);
    expect(net.mdns().queries.length).toBe(3);
    await browser.stop();
    expect(browser.active).toBe(false);
    expect(net.mdns().closed).toBe(true);
    expect(net.sockets.every((socket) => socket.closed)).toBe(true);
    vi.advanceTimersByTime(60000);
    expect(net.mdns().queries.length).toBe(3);
  });

  test('automation opens nothing and lists nothing', async () => {
    const net = createFakeNetwork();
    const browser = await startBrowser({ ports: net.ports, automation: true });
    browser.refresh();
    await browser.stop();
    expect(browser.list()).toEqual([]);
    expect(net.sockets).toEqual([]);
    expect(net.mdnsPorts).toEqual([]);
  });
});
