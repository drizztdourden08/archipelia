/* @layer tests @kind test */
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import type { CoreDomains, CoreEvent } from '../src';
import { startCore } from '../src';
import { createRoomSecrets } from '../src/core/room-secrets/create-room-secrets';
import { createNodeDomains, createNodeRest, nodeLanHost } from '../src/node';
import { connectWebSocket } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { replies } from './replies';

let dataDir = '';

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'archipelia-node-core-'));
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true });
});

const hostOf = (log: string[]): ServerHost<CoreDomains> => ({
  dataDir, args: [], log: (message) => { log.push(message); }, domains: createNodeDomains(dataDir),
});

describe('the core under plain Node', () => {
  test('starts on a temp data folder with Node storage, secrets and jobs', async () => {
    const log: string[] = [];
    const events: CoreEvent[] = [];
    const host = hostOf(log);
    const { core, stop } = startCore(host, createNodeRest(host, { onEvent: (event) => events.push(event) }));
    expect(await core.installed()).toEqual([]);
    expect((await core.engine.status()).dir).toBe(join(dataDir, 'Data', 'engine'));
    const preset = await core.presets.create({ game: 'ChecksFinder', name: 'First', values: {} });
    expect((await core.presets.list()).map((entry) => entry.id)).toEqual([preset.id]);
    expect(await readFile(join(dataDir, 'Data', 'presets', `${preset.id}.json`), 'utf8')).toContain('First');
    await expect(Promise.resolve(stop())).resolves.toBeUndefined();
    expect(log).toEqual([]);
  });

  test('keeps the secrets in a file of the data folder', async () => {
    const host = hostOf([]);
    const rest = createNodeRest(host);
    await rest.secrets.set('room-owner', 'abc');
    expect(await rest.secrets.get('room-owner')).toBe('abc');
    expect(await readFile(join(dataDir, 'secrets', 'secrets.json'), 'utf8')).toContain('room-owner');
  });

  test('keeps a room password in that same file, since the file store can always store', async () => {
    const host = hostOf([]);
    const rest = createNodeRest(host);
    const secrets = createRoomSecrets({ vault: rest.secrets, canStore: () => true, log: () => undefined });
    await secrets.set('lobby-room-lb_1', 'room-pw');
    expect(await secrets.get('lobby-room-lb_1')).toBe('room-pw');
    expect(await readFile(join(dataDir, 'secrets', 'secrets.json'), 'utf8')).toContain('lobby-room-lb_1');
  });

  test('an environment variable overrides a stored secret', async () => {
    const host = hostOf([]);
    const rest = createNodeRest(host, { env: { BROCK_SECRET_ROOM_OWNER: 'from-env' } });
    await rest.secrets.set('room-owner', 'abc');
    expect(await rest.secrets.get('room-owner')).toBe('from-env');
  });

  test('refuses to start without the data domains', () => {
    const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined };
    expect(() => startCore(host, createNodeRest(host))).toThrow('the core needs the data domains of its host');
  });

  test('picks an address for the lobby', () => {
    expect(nodeLanHost()).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });
});

const started = () => {
  const host = hostOf([]);
  return startCore(host, createNodeRest(host, { automation: true }));
};

describe('the lobby listener of the core', () => {
  test('binds loopback under automation, answers the admin API with its token and lobby.info for the lobby it made', async () => {
    const server = started();
    const endpoint = await server.listen({ port: 0, mode: 'lan-and-internet' });
    expect(endpoint.host).toBe('127.0.0.1');
    expect(endpoint.reach()).toMatchObject({ mode: 'lan-and-internet', advertising: false });
    const token = await server.core.adminToken();
    expect(await readFile(join(dataDir, 'Data', 'server', 'admin-token'), 'utf8')).toBe(token);
    const admin = await connectWebSocket(`ws://127.0.0.1:${endpoint.port}/archipelia/admin`);
    const next = replies(admin);
    admin.send(JSON.stringify({ type: 'admin.hello', seq: 1, token }));
    expect(await next()).toMatchObject({ type: 'admin.welcome', re: 1 });
    admin.send(JSON.stringify({ type: 'lobby.create', seq: 2, name: 'Night run', engine: { id: 'e', ap: '0.6.8', python: '3.12.0' } }));
    const created = await next('admin.reply');
    const lobby = (created.result ?? {}) as { code: string };
    expect(created).toMatchObject({ type: 'admin.reply', re: 2, ok: true });
    const client = await connectWebSocket(`ws://127.0.0.1:${endpoint.port}/archipelia/lobby`);
    const answer = replies(client);
    client.send(JSON.stringify({ type: 'lobby.info', seq: 1, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: lobby.code } }));
    expect(await answer()).toMatchObject({ type: 'lobby.info.reply', re: 1, lobby: { name: 'Night run', engine: { ap: '0.6.8' }, admission: 'host-approval', joinable: true } });
    client.close();
    admin.close();
    await server.stop();
  });

  test('refuses an admin hello with a wrong token', async () => {
    const server = started();
    const endpoint = await server.listen({ port: 0, mode: 'off' });
    const admin = await connectWebSocket(`ws://127.0.0.1:${endpoint.port}/archipelia/admin`);
    const next = replies(admin);
    admin.send(JSON.stringify({ type: 'admin.hello', token: 'wrong' }));
    expect(await next()).toMatchObject({ type: 'error', code: 'admin-refused', fatal: true });
    await server.stop();
  });
});
