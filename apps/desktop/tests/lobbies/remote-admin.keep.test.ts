/* @layer tests @kind test */
import { X509Certificate, createHash } from 'node:crypto';
import { afterEach, describe, expect, test } from 'vitest';
import { createLobbyOps } from '../../electron/lobbies/create-lobby-ops';
import { openRemoteChannel } from '../../electron/lobbies/remote/open-remote-channel';
import { testRemoteServer } from '../../electron/lobbies/remote/test-remote-server';
import type { LobbyRequest } from '../../src/lobbies/lobbies.type';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { ENGINE, startFixture } from './admin-fixture';
import { TEST_CERT, TEST_KEY } from './test-certificate';

type Fixture = Awaited<ReturnType<typeof startFixture>>;

const running: Fixture[] = [];

const serve = async (secure = false) => {
  const fixture = await startFixture(secure ? { port: 0, mode: 'off', tls: { key: TEST_KEY, cert: TEST_CERT } } : { port: 0, mode: 'off' });
  running.push(fixture);
  return fixture;
};

afterEach(async () => {
  await Promise.all(running.splice(0).map((fixture) => fixture.stop()));
});

const certificateSha256 = createHash('sha256').update(new X509Certificate(TEST_CERT).raw).digest('hex');

const createRequest: LobbyRequest = { type: 'lobby.create', params: { name: 'Friday seed', options: { admission: 'host-approval', allowUnlisted: false, maxSlots: 4, room: { kind: 'archipelago-gg' } } } };

describe('the remote admin client against the real listener', () => {
  test('lists, creates and locks a lobby over ws', async () => {
    const { endpoint, token } = await serve();
    const { channel, info } = await openRemoteChannel({ url: `ws://127.0.0.1:${endpoint.port}`, token });
    expect(info).toMatchObject({ name: 'Archipelia', tls: false });
    const ops = createLobbyOps(channel);
    const request = createRequest;
    const created = await ops.act({ ...request, params: { ...request.params, engine: ENGINE } });
    expect(created).toMatchObject({ name: 'Friday seed', phase: 'open', options: { maxSlots: 4 } });
    expect(JSON.stringify(created)).not.toContain('tokenHash');
    expect((await ops.list()).map((lobby) => lobby.id)).toEqual([created.id]);
    const seen: string[] = [];
    channel.watch((lobby) => seen.push(lobby.phase));
    expect((await ops.act(lobbyRequest.lock(created.id))).phase).toBe('locked');
    expect(seen).toContain('locked');
    channel.close();
  });

  test('refuses a wrong token with the sentence of the server', async () => {
    const { endpoint } = await serve();
    await expect(openRemoteChannel({ url: `ws://127.0.0.1:${endpoint.port}`, token: 'wrong' })).rejects.toThrow('The admin token is wrong.');
  });

  test('turns a request the server cannot do into an error', async () => {
    const { endpoint, token } = await serve();
    const { channel } = await openRemoteChannel({ url: `ws://127.0.0.1:${endpoint.port}`, token });
    await expect(createLobbyOps(channel).act(lobbyRequest.lock('lb_missing'))).rejects.toThrow();
    channel.close();
  });

  test('shows the fingerprint of an unknown certificate and never sends the token', async () => {
    const { endpoint, token } = await serve(true);
    const result = await testRemoteServer({ url: `wss://127.0.0.1:${endpoint.port}`, token });
    expect(result).toMatchObject({ ok: false, certSha256: certificateSha256 });
  });

  test('connects over wss once the certificate is pinned, and tells a changed pin', async () => {
    const { endpoint, token } = await serve(true);
    const url = `wss://127.0.0.1:${endpoint.port}`;
    const pinned = await testRemoteServer({ url, token, certSha256: certificateSha256 });
    expect(pinned).toMatchObject({ ok: true, info: { tls: true } });
    const changed = await testRemoteServer({ url, token, certSha256: '0'.repeat(64) });
    expect(changed).toMatchObject({ ok: false, certSha256: certificateSha256 });
  });

  test('reports a server that is not there in one sentence', async () => {
    const result = await testRemoteServer({ url: 'ws://127.0.0.1:1', token: 'x' });
    expect(result.ok).toBe(false);
    expect(result.message.length).toBeGreaterThan(0);
  });
});
