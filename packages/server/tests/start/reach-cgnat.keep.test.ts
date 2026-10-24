/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { startReach } from '../../src/start/reach/start-reach';
import { createFakeNetwork } from '../network/fake-network';
import { createFakeRouter, createFakeUpnp } from '../network/fake-router';

const reachOn = async (externalIp: string, secure: boolean) => {
  const router = createFakeRouter({ externalIp, natpmp: true });
  const net = createFakeNetwork({ gateway: router.reply });
  return startReach({
    port: 38290, secure, mode: 'lan-and-internet', automation: false,
    ports: {
      network: net.ports,
      mapping: { openUdp: net.ports.openUdp, interfaces: net.ports.interfaces, createUpnp: createFakeUpnp().create, retryDelaysMs: [2, 2] },
      lookup: null,
    },
    server: { id: 'srv_1', name: 'Test' }, lobbies: () => Promise.resolve([]), fallbackAp: () => Promise.resolve('0.6.7'), watch: () => () => undefined, log: () => undefined,
  });
};

describe('the reach of a server behind carrier-grade NAT', () => {
  test('carries the plain explanation when the router address is shared', async () => {
    const reach = await reachOn('100.72.3.4', true);
    const { cgnat, lobbyPort } = reach.status();
    expect(cgnat).toContain('carrier-grade NAT');
    expect(cgnat).toBe(lobbyPort);
    await reach.stop();
  });

  test('has none when the router address is public, and none while the lobby is LAN-only', async () => {
    const mapped = await reachOn('203.0.113.9', true);
    expect(mapped.status().cgnat).toBeNull();
    expect(mapped.status().lobbyPort).toContain('opened on your router');
    await mapped.stop();
    const lanOnly = await reachOn('100.72.3.4', false);
    expect(lanOnly.status()).toMatchObject({ cgnat: null, lobbyPort: expect.stringContaining('local network') as string });
    await lanOnly.stop();
  });
});
