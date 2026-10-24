/* @layer tests @kind test */
import { connect } from 'node:net';
import { describe, expect, test } from 'vitest';
import type { Lobby } from '@archipelia/model';
import { setStates } from '../../src/lobby/checks/set-states';
import { lobbyOptions } from '../../src/lobby/state/lobby-options';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import { startListener } from '../../src/listener/start-listener';
import { admin, engine, fileOf, helloOf, holdFiles, linkOf, startService, tick } from './security-kit';
import { fakeTrust, testDeps } from './test-deps';

const unlistedHello = () => {
  const world = helloOf().worlds[0];
  return helloOf({ client: { id: 'quest-client', name: 'Quest Client', version: '1.0.0', platform: { os: 'linux', arch: 'x64' } }, worlds: world ? [{ ...world, proof: { method: 'none' } }] : [] });
};

const slotOf = (lobby: Lobby | undefined) => lobby?.members[0]?.slots[0];

const markOk = (lobby: Lobby): Lobby => ({ ...lobby, members: lobby.members.map((member) => ({ ...member, slots: member.slots.map((slot) => ({ ...slot, state: 'ok' })) })) });

describe('review: connections and slots', () => {
  test('N1: a client that drips one byte at a time is dropped at the fixed upgrade deadline', async () => {
    const kit = await startService();
    const listener = await startListener({ service: kit.service, host: '127.0.0.1', port: 0, serverVersion: 't', admin, upgradeTimeoutMs: 300 });
    const socket = connect(listener.port, '127.0.0.1');
    socket.on('error', () => undefined);
    const drip = setInterval(() => socket.write('G'), 50);
    const started = Date.now();
    await new Promise((resolve) => socket.on('close', resolve));
    clearInterval(drip);
    expect(Date.now() - started).toBeLessThan(2000);
    await listener.stop();
    await kit.stop();
  });

  test('N2: slots.set that keeps no slot is refused, and a member with no slot holds a slot and cannot upload its world', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Empty', engine, options: { admission: 'open', maxSlots: 2 } });
    await kit.service.addHost(lobby.id, { displayName: 'Host', slots: [{ name: 'Link', game: 'Relic of the Past', yaml: 'name: Link\ngame: Relic of the Past\n', worldVersion: '0.1.0' }] });
    const joined = await kit.service.protocol.join(helloOf(), linkOf().link);
    if (!joined.ok) throw new Error(joined.failure.message);
    const world = fileOf('W');
    const begin = await kit.service.protocol.uploadBegin(joined.value, { type: 'upload.begin', seq: 2, sha256: world.sha256, kind: 'world', size: world.bytes.length });
    expect(begin[0]).toMatchObject({ type: 'error', code: 'upload-unexpected' });
    const set = await kit.service.protocol.slots(joined.value, { type: 'slots.set', seq: 3, worlds: helloOf().worlds, slots: helloOf().slots });
    expect(set[0]).toMatchObject({ type: 'error', code: 'slot-name-taken' });
    const third = await kit.service.protocol.join(helloOf({ player: { displayName: 'Other' }, slots: [{ ...fileOf('Y2'), name: 'Link2', game: 'Relic of the Past', yaml: { sha256: fileOf('Y2').sha256, size: fileOf('Y2').bytes.length } }] }), linkOf().link);
    expect(third).toMatchObject({ ok: false, failure: { code: 'lobby-full' } });
    await kit.stop();
  });

  test('F6: a lobby that locked refuses a new member', async () => {
    const kit = await startService();
    const lobby = await kit.service.create({ name: 'Locked', engine });
    await kit.service.lock(lobby.id);
    expect(await kit.service.protocol.join(helloOf(), linkOf().link)).toMatchObject({ ok: false, failure: { code: 'lobby-locked' } });
    await kit.stop();
  });
});

describe('review: stale checks and start', () => {
  test('F1: a verdict for world W1 is not applied once the slot uses W2', () => {
    const verdict = { memberId: 'm_1', slot: 'Link', from: 'checking' as const, yamlSha256: 'y', worldSha256: 'w1', state: 'ok' as const };
    const member = { id: 'm_1', kind: 'client' as const, displayName: 'Link', admission: 'approved' as const, trust: 'verified' as const, ready: false, joinedAt: 0, lastSeenAt: 0,
      slots: [{ name: 'Link', game: 'G', yamlSha256: 'y', yamlSize: 1, worldSha256: 'w2', state: 'checking' as const }] };
    const draft: Lobby = { id: 'l', code: 'c', name: 'n', phase: 'open', rev: 1, engine, options: lobbyOptions(), members: [member], worlds: [], nextMember: 2, createdAt: 0, closesAt: 0 };
    expect(setStates(draft, [verdict])).toEqual([]);
    expect(member.slots[0]?.state).toBe('checking');
  });

  test('F1: a slots.set sent while a check runs leaves the new slot unchecked', async () => {
    let release = () => undefined as void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const kit = await startService({ trust: fakeTrust('active', false, () => gate) });
    const lobby = await kit.service.create({ name: 'Swap', engine, options: { admission: 'open' } });
    const joined = await kit.service.protocol.join(helloOf(), linkOf().link);
    if (!joined.ok) throw new Error(joined.failure.message);
    await holdFiles(kit.store, lobby.id, ['W', 'Y']);
    const settling = kit.service.protocol.settle(lobby.id);
    await tick();
    const y2 = fileOf('Y2');
    const swapping = kit.service.protocol.slots(joined.value, { type: 'slots.set', seq: 2, worlds: helloOf().worlds, slots: [{ name: 'Link2', game: 'Relic of the Past', yaml: { sha256: y2.sha256, size: y2.bytes.length } }] });
    release();
    await Promise.all([settling, swapping]);
    const slot = slotOf(await kit.service.get(lobby.id));
    expect({ name: slot?.name, state: slot?.state }).toEqual({ name: 'Link2', state: 'uploading' });
    await kit.stop();
  });

  test('F1: start refuses an unlisted world that the host never allowed', async () => {
    const kit = await startService({ run: () => Promise.reject(new Error('must not run')) });
    const lobby = await kit.service.create({ name: 'Consent', engine, options: { admission: 'open', allowUnlisted: true } });
    await kit.service.protocol.join(unlistedHello(), linkOf().link);
    await holdFiles(kit.store, lobby.id, ['W', 'Y']);
    await kit.service.protocol.settle(lobby.id);
    const waiting = await kit.service.get(lobby.id);
    expect(slotOf(waiting)?.state).toBe('waiting-consent');
    if (!waiting) throw new Error('no lobby');
    await kit.store.save(markOk(waiting));
    const reloaded = createLobbyService(testDeps({ store: kit.store, output: kit.domains.domain('sessions'), root: kit.dataDir, trust: fakeTrust('active'), run: () => Promise.reject(new Error('must not run')) }));
    const finished = await (await reloaded.start(lobby.id)).finished;
    expect(finished.phase).toBe('failed');
    expect(finished.failure?.message).toContain('has not allowed');
    await kit.stop();
  });
});
