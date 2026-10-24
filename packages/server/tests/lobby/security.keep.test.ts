/* @layer tests @kind test */
import { connect } from 'node:net';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { TransportEvent } from '@archipelia/lobby-protocol/node';
import type { Lobby } from '@archipelia/model';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import { createLobbyConnection } from '../../src/lobby/link/create-lobby-connection';
import { createRateLimiter } from '../../src/lobby/link/create-rate-limiter';
import { buildOverlay } from '../../src/lobby/overlay/build-overlay';
import { startListener } from '../../src/listener/start-listener';
import { admin, engine, fileOf, helloOf, holdFiles, linkOf, startService, tick } from './security-kit';
import { fakeTrust, testDeps } from './test-deps';

const joined = async (service: Awaited<ReturnType<typeof startService>>['service'], hello = helloOf()) => {
  const result = await service.protocol.join(hello, linkOf().link);
  if (!result.ok) throw new Error(result.failure.message);
  return result.value;
};

const slotOf = (lobby: Lobby | undefined, memberId: string) => lobby?.members.find((member) => member.id === memberId)?.slots[0];

describe('lobby security: checks', () => {
  test('F1: a check that finishes after the member was refused does not apply', async () => {
    let release = () => undefined as void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const kit = await startService({ trust: fakeTrust('active', false, () => gate) });
    const lobby = await kit.service.create({ name: 'Race', engine });
    const ref = await joined(kit.service);
    await holdFiles(kit.store, lobby.id, ['W', 'Y']);
    await kit.service.protocol.settle(lobby.id);
    const approving = kit.service.approve(lobby.id, ref.memberId);
    await tick();
    const refusing = kit.service.refuse(lobby.id, ref.memberId, 'gone');
    await tick();
    release();
    await Promise.all([approving, refusing]);
    const after = await kit.service.get(lobby.id);
    expect(after?.members[0]?.admission).toBe('refused');
    expect(slotOf(after, ref.memberId)?.state).toBe('checking');
    await kit.stop();
  });

});

describe('lobby security: connections', () => {
  test('F2: a fragmented message over the pre-welcome limit closes the socket with 1009', async () => {
    const kit = await startService();
    const listener = await startListener({ service: kit.service, host: '127.0.0.1', port: 0, serverVersion: 't', admin });
    const socket = connect(listener.port, '127.0.0.1');
    socket.on('error', () => undefined);
    const received: Buffer[] = [];
    socket.on('data', (chunk: Buffer) => received.push(chunk));
    const closed = new Promise((resolve) => socket.on('close', resolve));
    socket.write('GET /archipelia/lobby HTTP/1.1\r\nHost: x\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n');
    await tick(100);
    const piece = Buffer.alloc(30000, 0x61);
    for (const opcode of [0x01, 0x00, 0x00]) socket.write(Buffer.concat([Buffer.from([opcode, 126, piece.length >> 8, piece.length & 0xff]), piece]));
    await closed;
    expect(Buffer.concat(received).includes(Buffer.from([0x88, 0x02, 0x03, 0xf1]))).toBe(true);
    await listener.stop();
    await kit.stop();
  });

  test('F3: events after the server closed a connection are ignored, and a removed member is refused', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Closed', engine, options: { admission: 'open' } });
    const sent: string[] = [];
    let handler: (event: TransportEvent) => void = () => undefined;
    const transport = { send: (text: string) => sent.push(text), sendBinary: () => undefined, close: () => undefined, listen: (next: (event: TransportEvent) => void) => { handler = next; } };
    createLobbyConnection({ protocol: kit.service.protocol, limiter: createRateLimiter(), transport, address: '10.0.0.9', limit: { bytes: 65536 }, log: () => undefined });
    handler({ kind: 'binary', bytes: new Uint8Array([1]) });
    handler({ kind: 'text', text: JSON.stringify({ type: 'lobby.info', seq: 1, protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: lobby.code } }) });
    await tick();
    expect(sent).toHaveLength(1);
    const ref = await joined(kit.service);
    await kit.service.remove(lobby.id, ref.memberId);
    expect(await kit.service.protocol.active(ref)).toBe(false);
    const world = fileOf('W');
    const replies = await kit.service.protocol.uploadBegin(ref, { type: 'upload.begin', seq: 2, sha256: world.sha256, kind: 'world', size: world.bytes.length });
    expect(replies[0]).toMatchObject({ type: 'error', code: 'refused' });
    await kit.stop();
  });

});

describe('lobby security: files', () => {
  test('F4: replaced slots drop their partial uploads and undeclared files, and a removed member leaves no files', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Disk', engine, options: { admission: 'open' } });
    const ref = await joined(kit.service);
    await holdFiles(kit.store, lobby.id, ['W', 'Y']);
    const y2 = fileOf('Y2');
    const slotsSet = { type: 'slots.set' as const, seq: 3, worlds: helloOf().worlds, slots: [{ name: 'Link2', game: 'Relic of the Past', yaml: { sha256: y2.sha256, size: y2.bytes.length } }] };
    await kit.service.protocol.slots(ref, slotsSet);
    expect((await kit.store.listFiles(lobby.id)).sort()).toEqual([fileOf('W').sha256]);
    await kit.service.protocol.uploadBegin(ref, { type: 'upload.begin', seq: 4, sha256: y2.sha256, kind: 'yaml', size: y2.bytes.length });
    await kit.service.protocol.uploadChunk(ref, { type: 'upload.chunk', sha256: y2.sha256, offset: 0, data: Buffer.from(y2.bytes.subarray(0, 100)).toString('base64') });
    await kit.service.protocol.slots(ref, { ...slotsSet, seq: 5 });
    const again = await kit.service.protocol.uploadBegin(ref, { type: 'upload.begin', seq: 6, sha256: y2.sha256, kind: 'yaml', size: y2.bytes.length });
    expect(again[0]).toMatchObject({ type: 'upload.ready', offset: 0 });
    await kit.service.remove(lobby.id, ref.memberId);
    expect(await kit.store.listFiles(lobby.id)).toEqual([]);
    await kit.stop();
  });

});

describe('lobby security: timeouts and starts', () => {
  test('F5: a socket that never upgrades is dropped after the upgrade timeout', async () => {
    const kit = await startService();
    const listener = await startListener({ service: kit.service, host: '127.0.0.1', port: 0, serverVersion: 't', admin, upgradeTimeoutMs: 200 });
    const socket = connect(listener.port, '127.0.0.1');
    socket.on('error', () => undefined);
    const started = Date.now();
    await new Promise((resolve) => socket.on('close', resolve));
    expect(Date.now() - started).toBeLessThan(3000);
    await listener.stop();
    await kit.stop();
  });

  test('F6: two starts at once run one generation', async () => {
    let runs = 0;
    const kit = await startService({ run: (template, lobby) => {
      runs += 1;
      return Promise.resolve({ id: 's', snapshot: template, status: 'failed', createdAt: 0, lobbyId: lobby.lobbyId, error: 'stop' });
    } });
    const lobby = await kit.service.create({ name: 'Twice', engine });
    await kit.service.addHost(lobby.id, { displayName: 'Host', slots: [{ name: 'Host', game: 'Clique', yaml: 'name: Host\ngame: Clique\n', worldVersion: '1.0.0' }] });
    const results = await Promise.allSettled([kit.service.start(lobby.id), kit.service.start(lobby.id)]);
    await Promise.all(results.map((result) => (result.status === 'fulfilled' ? result.value.finished : Promise.resolve(null))));
    expect(results.map((result) => result.status).sort()).toEqual(['fulfilled', 'rejected']);
    expect(runs).toBe(1);
    await kit.stop();
  });

});

describe('lobby security: worlds', () => {
  test('F7: a world sent by another member does not clear an unlisted member', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Foreign', engine, options: { admission: 'open', allowUnlisted: true } });
    const listed = await joined(kit.service);
    const world = helloOf().worlds[0];
    const y2 = fileOf('Y2');
    const unlisted = await joined(kit.service, helloOf({
      client: { id: 'quest-client', name: 'Quest Client', version: '1.0.0', platform: { os: 'linux', arch: 'x64' } },
      worlds: world ? [{ ...world, proof: { method: 'none' } }] : [],
      slots: [{ name: 'Link2', game: 'Relic of the Past', yaml: { sha256: y2.sha256, size: y2.bytes.length } }],
    }));
    await holdFiles(kit.store, lobby.id, ['W', 'Y', 'Y2']);
    await kit.service.protocol.settle(lobby.id);
    const after = await kit.service.get(lobby.id);
    expect(slotOf(after, listed.memberId)?.state).toBe('ok');
    expect(slotOf(after, unlisted.memberId)?.state).toBe('waiting-consent');
    await kit.stop();
  });

  test('F8: a write through the overlay cannot change the engine', async () => {
    const root = await mkdtemp(join(tmpdir(), 'archipelia-engine-'));
    await mkdir(join(root, 'ap', 'custom_worlds'), { recursive: true });
    await writeFile(join(root, 'ap', 'Utils.py'), 'engine');
    await writeFile(join(root, 'ap', 'custom_worlds', 'probe.apworld'), 'engine world');
    const runtime = { id: 'e', apVersion: '0.6.8', apCommit: 'c', pythonVersion: '3', root, python: 'python', generate: join(root, 'ap', 'Generate.py'), multiServer: join(root, 'ap', 'MultiServer.py'), schemaScript: 's' };
    const overlay = await buildOverlay({ lobbyId: 'l', dir: join(root, 'overlay'), runtime, worlds: [{ module: 'probe', sha256: 'x', bytes: new TextEncoder().encode('lobby world') }] });
    await writeFile(join(overlay.root, 'ap', 'Utils.py'), 'changed');
    expect(await readFile(join(root, 'ap', 'Utils.py'), 'utf8')).toBe('engine');
    expect(await readFile(join(root, 'ap', 'custom_worlds', 'probe.apworld'), 'utf8')).toBe('engine world');
    await rm(root, { recursive: true, force: true });
  });

});

describe('lobby security: reload', () => {
  test('F9: a reload fails an interrupted generation and stops a room with no live session', async () => {
    const kit = await startService();
    const generating = await kit.service.create({ name: 'Gen', engine });
    const hosting = { ...generating, id: 'lb_hosting', code: 'ABCD1234' };
    await kit.store.save({ ...generating, phase: 'generating' });
    await kit.store.save({ ...hosting, phase: 'hosting', room: { seed: '1', zip: 'z', host: 'h', port: 1, tls: 'no', files: [], state: 'hosting' } });
    const output = kit.domains.domain('sessions');
    const reloaded = createLobbyService(testDeps({ store: kit.store, output, root: kit.dataDir, trust: fakeTrust('active'), run: () => Promise.reject(new Error('none')) }));
    expect((await reloaded.get(generating.id))?.phase).toBe('failed');
    expect((await reloaded.get(hosting.id))?.room?.state).toBe('stopped');
    await kit.stop();
  });
});
