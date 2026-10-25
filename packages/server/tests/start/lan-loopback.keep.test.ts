/* @layer tests @kind test */
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { connectWebSocket } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import type { CoreDomains } from '../../src';
import { startCore } from '../../src';
import { createNodeDomains, createNodeRest } from '../../src/node';
import { createFakeNetwork } from '../network/fake-network';
import { createFakeUpnp } from '../network/fake-router';

const HASH = 'a'.repeat(64);

let dataDir = '';

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'archipelia-lan-'));
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});

const hello = (code: string) => ({
  type: 'hello', seq: 1, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code }, resume: null,
  client: { id: 'same-pc-client', name: 'Same PC client', version: '0.1.0', platform: { os: 'windows', arch: 'x64' } },
  player: { displayName: 'Link' }, archipelago: { version: '0.6.8' }, capabilities: ['slots.yaml', 'worlds.upload'],
  worlds: [{ game: 'Relic of the Past', module: 'relic_of_the_past', worldVersion: '0.1.0', sha256: HASH, size: 100 }],
  slots: [{ name: 'Link', game: 'Relic of the Past', yaml: { sha256: 'b'.repeat(64), size: 40 } }],
});

const nextReply = (transport: Awaited<ReturnType<typeof connectWebSocket>>, type: string) =>
  new Promise<Record<string, unknown>>((resolve) => transport.listen((event) => {
    if (event.kind !== 'text') return;
    const message = JSON.parse(event.text) as Record<string, unknown>;
    if (message.type === type) resolve(message);
  }));

describe('the lobby server in LAN mode', () => {
  test('listens on the network, announces itself and still lets a client on the same computer join an open lobby', async () => {
    const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined, domains: createNodeDomains(dataDir) };
    const server = startCore(host, createNodeRest(host, { automation: false, lanHost: () => '192.168.1.20' }));
    const net = createFakeNetwork({});
    const endpoint = await server.listen({
      port: 0, mode: 'lan',
      reachPorts: { network: net.ports, mapping: { openUdp: net.ports.openUdp, interfaces: net.ports.interfaces, createUpnp: createFakeUpnp().create, retryDelaysMs: [2, 2] }, lookup: null },
    });
    expect(endpoint.host).toBe('0.0.0.0');
    expect(endpoint.reach()).toMatchObject({ mode: 'lan', advertising: true });
    const lobby = await server.core.lobbies.create({
      name: 'Friday seed', engine: { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' },
      options: { admission: 'open', allowUnlisted: true, maxSlots: 16, room: { kind: 'local', port: 38281 } },
    });
    const url = `ws://127.0.0.1:${endpoint.port}/archipelia/lobby`;

    const info = await connectWebSocket(url);
    const reply = nextReply(info, 'lobby.info.reply');
    info.send(JSON.stringify({ type: 'lobby.info', seq: 1, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: lobby.code } }));
    expect(await reply).toMatchObject({ lobby: { name: 'Friday seed', joinable: true, admission: 'open' } });
    info.close();

    const joined = await connectWebSocket(url);
    const welcome = nextReply(joined, 'welcome');
    joined.send(JSON.stringify(hello(lobby.code)));
    expect(await welcome).toMatchObject({ lobby: { name: 'Friday seed', phase: 'open' }, member: { admission: 'approved', trust: 'unlisted' } });
    joined.close();

    await endpoint.stop();
    await server.stop();
  }, 30000);

  test('binds the loopback only, announces nothing and maps no port when the mode is off', async () => {
    const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined, domains: createNodeDomains(dataDir) };
    const server = startCore(host, createNodeRest(host, { automation: false, lanHost: () => '192.168.1.20' }));
    const endpoint = await server.listen({ port: 0, mode: 'off' });
    expect(endpoint.host).toBe('127.0.0.1');
    expect(endpoint.reach()).toMatchObject({ mode: 'off', advertising: false, lobbyPort: null });
    await endpoint.stop();
    await server.stop();
  });
});
