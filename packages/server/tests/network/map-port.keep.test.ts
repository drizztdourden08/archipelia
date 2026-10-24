/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { MapPortOptions, MappingState } from '../../src/network';
import { mapPort } from '../../src/network';
import { createFakeNetwork } from './fake-network';
import { createFakeRouter, createFakeUpnp } from './fake-router';

afterEach(() => {
  vi.useRealTimers();
});

type Setup = {
  router?: Parameters<typeof createFakeRouter>[0];
  upnp?: Parameters<typeof createFakeUpnp>[0];
  publicAddress?: string | null;
  automation?: boolean;
  onChange?: (state: MappingState) => void;
};

const setup = ({ router, upnp, publicAddress, automation = false, onChange }: Setup = {}) => {
  const fakeRouter = createFakeRouter(router ?? { externalIp: '203.0.113.9' });
  const fakeUpnp = createFakeUpnp(upnp);
  const net = createFakeNetwork({ gateway: router ? fakeRouter.reply : undefined });
  const options: MapPortOptions = {
    port: 38290,
    protocol: 'tcp',
    ttl: 3600,
    automation,
    onChange,
    ports: {
      openUdp: net.ports.openUdp,
      interfaces: net.ports.interfaces,
      createUpnp: fakeUpnp.create,
      retryDelaysMs: [2, 2],
      lookupPublicAddress: publicAddress === undefined ? undefined : () => Promise.resolve(publicAddress),
    },
  };
  return { options, net, requests: fakeRouter.requests, upnp: fakeUpnp };
};

describe('mapping over PCP and NAT-PMP', () => {
  test('maps over PCP, reports the external address and unmaps on stop', async () => {
    const { options, requests, upnp } = setup({ router: { externalIp: '203.0.113.9', pcp: true, natpmp: true } });
    const result = await mapPort(options);
    expect(result.ok && result.method).toBe('pcp');
    expect(result.ok && result.external).toEqual({ address: '203.0.113.9', port: 38290 });
    expect(result.ok && result.message).toContain('Port 38290 opened on your router (pcp)');
    expect(requests.map((request) => request.kind)).toEqual(['pcp']);
    expect(requests[0]).toMatchObject({ internal: 38290, external: 38290, lifetime: 3600 });
    await result.stop();
    expect(requests.at(-1)).toMatchObject({ kind: 'pcp', lifetime: 0, nonce: requests[0]?.nonce });
    expect(upnp.created()).toBe(0);
  });

  test('falls back to NAT-PMP when the router answers PCP with unsupported version', async () => {
    const { options, requests } = setup({ router: { externalIp: '203.0.113.9', natpmp: true } });
    const result = await mapPort(options);
    expect(result.ok && result.method).toBe('nat-pmp');
    expect(result.ok && result.external).toEqual({ address: '203.0.113.9', port: 38290 });
    expect(requests.map((request) => request.kind)).toEqual(['natpmp-address', 'natpmp-map']);
    await result.stop();
    expect(requests.at(-1)).toMatchObject({ kind: 'natpmp-map', internal: 38290, external: 0, lifetime: 0 });
  });
});

describe('mapping over UPnP', () => {
  test('falls back to UPnP and removes the mapping on stop', async () => {
    const { options, upnp } = setup({ upnp: { publicIp: '203.0.113.9' } });
    const result = await mapPort(options);
    expect(result.ok && result.method).toBe('upnp');
    expect(result.ok && result.external).toEqual({ address: '203.0.113.9', port: 38290 });
    await result.stop();
    expect(upnp.calls).toEqual(['create TCP 38290 ttl 3600', 'remove TCP 38290', 'close']);
  });

  test('asks for a permanent lease when the router refuses leases, and never renews it', async () => {
    vi.useFakeTimers();
    const { options, upnp } = setup({ upnp: { permanentOnly: true } });
    const pending = mapPort(options);
    await vi.advanceTimersByTimeAsync(20);
    const result = await pending;
    expect(result.ok && result.ttl).toBe(0);
    expect(upnp.calls).toEqual(['create TCP 38290 ttl 3600', 'create TCP 38290 ttl 0']);
    await vi.advanceTimersByTimeAsync(24 * 3600 * 1000);
    expect(upnp.calls).toHaveLength(2);
    await result.stop();
  });
});

describe('renewal', () => {
  test('renews at half the lifetime, reports a lost mapping, recovers and unmaps on stop', async () => {
    vi.useFakeTimers();
    let answering = true;
    const states: MappingState[] = [];
    const { options, requests } = setup({
      router: { externalIp: '203.0.113.9', natpmp: true, answering: () => answering },
      onChange: (state) => states.push(state),
    });
    const result = await mapPort(options);
    const maps = () => requests.filter((request) => request.kind === 'natpmp-map').length;
    expect(maps()).toBe(1);
    await vi.advanceTimersByTimeAsync(1799 * 1000);
    expect(maps()).toBe(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(maps()).toBe(2);
    expect(states).toEqual([]);
    answering = false;
    await vi.advanceTimersByTimeAsync(1800 * 1000 + 10);
    expect(states).toHaveLength(1);
    expect(states[0]).toMatchObject({ mapped: false, external: null });
    expect(states[0]?.message).toContain('could not be renewed');
    answering = true;
    await vi.advanceTimersByTimeAsync(60 * 1000);
    expect(states.at(-1)).toMatchObject({ mapped: true, external: { address: '203.0.113.9', port: 38290 } });
    await result.stop();
    const after = requests.length;
    expect(requests.at(-1)).toMatchObject({ kind: 'natpmp-map', lifetime: 0 });
    await vi.advanceTimersByTimeAsync(10 * 3600 * 1000);
    expect(requests).toHaveLength(after);
  });
});

describe('failure', () => {
  test('says no router answered when nothing responds', async () => {
    const { options } = setup({ upnp: { silent: true } });
    const result = await mapPort(options);
    expect(!result.ok && result.reason).toBe('no-router');
    expect(!result.ok && result.attempts.map((attempt) => [attempt.method, attempt.outcome])).toEqual([
      ['pcp', 'absent'],
      ['nat-pmp', 'absent'],
      ['upnp', 'absent'],
    ]);
    expect(!result.ok && result.message).toContain('Your router did not open port 38290');
    await result.stop();
  });

  test('reports a router that refuses', async () => {
    const { options } = setup({ router: { externalIp: '203.0.113.9', natpmp: true, code: 2 }, upnp: { fault: 606 } });
    const result = await mapPort(options);
    expect(!result.ok && result.reason).toBe('refused');
    expect(!result.ok && result.message).toContain('refused to open port 38290');
    expect(!result.ok && result.message).toContain('UPnP error 606');
  });

  test('automation maps nothing and opens nothing', async () => {
    const { options, net, upnp } = setup({ automation: true });
    const result = await mapPort(options);
    await result.stop();
    expect(!result.ok && result.reason).toBe('automation');
    expect(net.sockets).toEqual([]);
    expect(upnp.created()).toBe(0);
  });
});

describe('carrier-grade NAT', () => {
  test('detects a shared-range address, unmaps and explains the options', async () => {
    const { options, requests } = setup({ router: { externalIp: '100.72.3.4', natpmp: true } });
    const result = await mapPort(options);
    expect(!result.ok && result.reason).toBe('cgnat');
    expect(!result.ok && result.cgnat).toEqual({ kind: 'shared-range', address: '100.72.3.4', publicAddress: null });
    const message = result.ok ? '' : result.message;
    expect(message).toContain('carrier-grade NAT');
    expect(message).toContain('no relay');
    expect(message).toMatch(/public machine/);
    expect(message).toMatch(/open a port/);
    expect(message).toMatch(/VPN/);
    expect(requests.at(-1)).toMatchObject({ kind: 'natpmp-map', lifetime: 0 });
  });

  test('detects a private router address as a second router', async () => {
    const { options } = setup({ router: { externalIp: '192.168.0.5', natpmp: true } });
    const result = await mapPort(options);
    expect(!result.ok && result.cgnat?.kind).toBe('private-range');
  });

  test('detects a mapped address that differs from the public one', async () => {
    const router = { externalIp: '203.0.113.9', natpmp: true };
    const mismatch = await mapPort(setup({ router, publicAddress: '198.51.100.7' }).options);
    expect(!mismatch.ok && mismatch.reason).toBe('cgnat');
    expect(!mismatch.ok && mismatch.cgnat).toEqual({ kind: 'public-mismatch', address: '203.0.113.9', publicAddress: '198.51.100.7' });
  });

  test('accepts an address that matches the public one, or when the public one is unknown', async () => {
    const router = { externalIp: '203.0.113.9', natpmp: true };
    const same = await mapPort(setup({ router, publicAddress: '203.0.113.9' }).options);
    const unknown = await mapPort(setup({ router, publicAddress: null }).options);
    expect([same.ok, unknown.ok]).toEqual([true, true]);
    await same.stop();
    await unknown.stop();
  });
});
