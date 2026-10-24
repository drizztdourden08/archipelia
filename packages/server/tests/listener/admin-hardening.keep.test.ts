/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { connect } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import { connectWebSocket } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import type { CoreDomains } from '../../src';
import { startCore } from '../../src';
import { createNodeDomains, createNodeRest } from '../../src/node';
import { replies } from '../replies';

const ENGINE = { id: 'e', ap: '0.6.8', python: '3.12.0' };

const stops: (() => Promise<void>)[] = [];

afterEach(async () => {
  await Promise.all(stops.splice(0).map((stop) => stop()));
});

const serve = async (automation: boolean, mode: 'lan' | 'off' = 'off') => {
  const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-hardening-'));
  const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined, domains: createNodeDomains(dataDir) };
  const started = startCore(host, createNodeRest(host, { automation }));
  const endpoint = await started.listen({ port: 0, mode });
  stops.push(async () => {
    await started.stop();
    await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  });
  return { endpoint, token: await started.core.adminToken(), core: started.core };
};

const upgrade = (port: number, path: string, origin?: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const socket = connect({ host: '127.0.0.1', port });
    const lines = [`GET ${path} HTTP/1.1`, `Host: 127.0.0.1:${port}`, 'Upgrade: websocket', 'Connection: Upgrade', 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==', 'Sec-WebSocket-Version: 13'];
    if (origin) lines.push(`Origin: ${origin}`);
    socket.once('error', reject);
    socket.once('data', (chunk: Buffer) => {
      socket.destroy();
      resolve(chunk.toString('latin1').split('\r\n')[0] ?? '');
    });
    socket.write(`${lines.join('\r\n')}\r\n\r\n`);
  });

const admin = async (port: number, token: string) => {
  const transport = await connectWebSocket(`ws://127.0.0.1:${port}/archipelia/admin`);
  const take = replies(transport);
  transport.send(JSON.stringify({ type: 'admin.hello', seq: 1, token }));
  await take('admin.welcome');
  const call = async (type: string, params: Record<string, unknown>) => {
    transport.send(JSON.stringify({ ...params, type, seq: 2 }));
    return take('admin.reply');
  };
  return { call, close: () => transport.close() };
};

describe('a browser cannot open a socket to the server', () => {
  test('refuses an upgrade that carries an Origin header on the lobby path and the admin path', async () => {
    const { endpoint } = await serve(true);
    expect(await upgrade(endpoint.port, '/archipelia/lobby', 'https://evil.example')).toContain('403');
    expect(await upgrade(endpoint.port, '/archipelia/admin', 'null')).toContain('403');
    expect(await upgrade(endpoint.port, '/archipelia/lobby')).toContain('101');
    expect(await upgrade(endpoint.port, '/archipelia/admin')).toContain('101');
  });
});

describe('the admin API takes only options it knows', () => {
  test('refuses a password reference, an unknown key and a wrong type when a lobby is created', async () => {
    const { endpoint, token, core } = await serve(true);
    const api = await admin(endpoint.port, token);
    const create = (options: Record<string, unknown>) => api.call('lobby.create', { name: 'Friday', engine: ENGINE, options });
    const stolen = await create({ server: { passwordRef: 'gg-owner-id' } });
    expect(stolen).toMatchObject({ ok: false });
    expect(String(stolen.error)).toContain('options.server does not take passwordRef');
    expect(String(((await create({ limits: { worldBytes: 1 } })).error))).toContain('options does not take limits');
    expect(String(((await create({ maxSlots: '16' })).error))).toContain('options.maxSlots must be a whole number');
    expect(String(((await create({ room: { kind: 'local', port: 80 } })).error))).toContain('options.room.port');
    expect(String(((await create({ room: { kind: 'archipelago-gg', baseUrl: 'http://x.test' } })).error))).toContain('https://');
    expect(String(((await create({ admission: 'anyone' })).error))).toContain('options.admission');
    expect(await core.lobbies.list()).toEqual([]);
    api.close();
  });

  test('keeps the defaults of the sections it was not given and sets no password reference itself', async () => {
    const { endpoint, token, core } = await serve(true);
    const api = await admin(endpoint.port, token);
    const made = await api.call('lobby.create', { name: 'Friday', engine: ENGINE, options: { maxSlots: 4, server: { hintCost: 5 }, room: { kind: 'local', port: 40000 } } });
    expect(made).toMatchObject({ ok: true });
    const [lobby] = await core.lobbies.list();
    expect(lobby?.options).toMatchObject({ maxSlots: 4, room: { kind: 'local', port: 40000 }, server: { hintCost: 5, releaseMode: 'goal' }, generator: { spoiler: 1 } });
    expect(lobby?.options.server.passwordRef).toBeUndefined();
    const refused = await api.call('lobby.update', { lobbyId: lobby?.id, options: { server: { passwordRef: 'x' } } });
    expect(refused).toMatchObject({ ok: false });
    expect((await core.lobbies.get(lobby?.id ?? ''))?.options.server.passwordRef).toBeUndefined();
    const bad = await api.call('lobby.create', { name: 'Bad', engine: { id: 'e', ap: '0.6.8', python: '3', extra: 1 } });
    expect(String(bad.error)).toContain('engine does not take extra');
    api.close();
  });
});

describe('the network mode off', () => {
  test('binds the loopback address only, even when the app is not automated', async () => {
    expect((await serve(false, 'off')).endpoint.host).toBe('127.0.0.1');
    expect((await serve(false, 'lan')).endpoint.host).toBe('0.0.0.0');
  });
});
