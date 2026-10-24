/* @layer tests @kind test */
import { createServer } from 'node:net';
import { afterEach, describe, expect, test } from 'vitest';
import { DOMAIN } from '@archipelia/model';
import { createLobbyOps } from '../../electron/lobbies/create-lobby-ops';
import { createLobbyServer } from '../../electron/lobbies/create-lobby-server';
import { createLocalChannel } from '../../electron/lobbies/create-local-channel';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { ENGINE, startFixture } from './admin-fixture';

type Fixture = Awaited<ReturnType<typeof startFixture>>;

const running: Fixture[] = [];

const serve = async () => {
  const fixture = await startFixture();
  await fixture.endpoint.stop();
  running.push(fixture);
  return fixture;
};

const serverOf = ({ started, host }: Fixture, listen = started.listen, canStoreSecrets = () => true) =>
  createLobbyServer({ listen, files: (host.domains as NonNullable<typeof host.domains>).domain(DOMAIN.server), automation: true, canStoreSecrets, lanHost: () => '192.168.1.5', version: '1.2.3', log: () => undefined });

afterEach(async () => {
  await Promise.all(running.splice(0).map((fixture) => fixture.stop()));
});

describe('the embedded lobby server', () => {
  test('listens, restarts with a new mode and keeps the mode for the next start', async () => {
    const fixture = await serve();
    const server = serverOf(fixture);
    await server.start();
    expect(server.status()).toMatchObject({ state: 'listening', options: { mode: 'off', publicLookup: true }, lanAddress: '192.168.1.5', automation: true });
    expect(server.status().serverId).toMatch(/^srv_/);
    expect(server.status().roomPasswords).toBe('vault');
    const applied = await server.apply({ mode: 'lan-and-internet', publicLookup: false });
    expect(applied).toMatchObject({ state: 'listening', options: { mode: 'lan-and-internet', publicLookup: false }, reach: { mode: 'lan-and-internet', cgnat: null } });
    expect(applied.reach?.lobbyPort).toContain('local network');
    const next = serverOf(fixture);
    await next.start();
    expect(next.status().options).toEqual({ mode: 'lan-and-internet', publicLookup: false });
    expect(server.info()).toMatchObject({ name: 'Archipelia', version: '1.2.3', sandbox: 'none' });
    await next.stop();
  });

  test('refuses options it does not know and keeps the ones it has', async () => {
    const fixture = await serve();
    const server = serverOf(fixture);
    await server.start();
    await expect(server.apply({ mode: 'everywhere', publicLookup: true })).rejects.toThrow('not valid');
    await expect(server.apply('lan')).rejects.toThrow('not valid');
    expect(server.status()).toMatchObject({ state: 'listening', options: { mode: 'off' } });
    await server.stop();
  });

  test('says why it is not running when the port is taken', async () => {
    const fixture = await serve();
    const busy = createServer();
    await new Promise<void>((resolve) => busy.listen(0, '127.0.0.1', resolve));
    const { port } = busy.address() as { port: number };
    const server = serverOf(fixture, (options) => fixture.started.listen({ ...options, port }));
    await server.start();
    expect(server.status()).toMatchObject({ state: 'failed' });
    expect(server.status().error).toBeTruthy();
    await new Promise((resolve) => busy.close(resolve));
  });

  test('drives the lobbies of this computer in process', async () => {
    const fixture = await serve();
    const { core } = fixture.started;
    const channel = createLocalChannel({ service: core.lobbies, token: core.adminToken, watch: core.watchLobbies, sandbox: 'none', info: () => ({}), engines: () => core.engine.overview() });
    const ops = createLobbyOps(channel);
    const seen: string[] = [];
    channel.watch((lobby) => seen.push(lobby.phase));
    const request = lobbyRequest.create({ name: 'Local', admission: 'open', allowUnlisted: true, maxSlots: 2, room: { kind: 'local', port: 38281 } });
    const lobby = await ops.act({ ...request, params: { ...request.params, engine: ENGINE } });
    expect(lobby).toMatchObject({ name: 'Local', options: { admission: 'open', allowUnlisted: true, maxSlots: 2, room: { kind: 'local', port: 38281 } } });
    expect(JSON.stringify(lobby)).not.toContain('tokenHash');
    await ops.act(lobbyRequest.close(lobby.id));
    expect(seen).toContain('closed');
    await expect(ops.act({ type: 'engine.install' as 'lobby.lock', params: {} })).rejects.toThrow('not a lobby request');
    expect((await ops.view()).info).toEqual({});
  });
});

describe('the embedded lobby server without a keyring', () => {
  test('says the room passwords live in memory when the vault cannot encrypt', async () => {
    const fixture = await serve();
    const server = serverOf(fixture, fixture.started.listen, () => false);
    await server.start();
    expect(server.status().roomPasswords).toBe('memory');
    await server.stop();
  });
});
