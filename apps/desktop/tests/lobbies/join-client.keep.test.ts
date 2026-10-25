/* @layer tests @kind test */
import { afterEach, describe, expect, test } from 'vitest';
import type { AdminLobby, LobbyOptions } from '@archipelia/model';
import { startLobbyRig } from '@archipelia/server/testing';
import { joinRecord, startJoins } from './join-kit';
import { tempFiles } from './temp-files';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

const cleanups: (() => Promise<unknown>)[] = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
});

const setUp = async (ap: string, options: Partial<LobbyOptions>) => {
  const rig = await startLobbyRig();
  cleanups.push(rig.stop);
  const store = await tempFiles('joins');
  cleanups.push(store.remove);
  const lobby = (await rig.call('lobby.create', { name: 'Friday seed', engine: { id: `ap-${ap}`, ap, python: '3.12.0' }, options: { room: { kind: 'archipelago-gg' }, ...options } })) as AdminLobby;
  return { rig, lobby, files: store.files, record: await joinRecord(rig.address, lobby.code) };
};

const memberOf = async (rig: Rig, lobbyId: string) => (await rig.service.get(lobbyId))?.members.find((member) => member.displayName === 'Cy');

describe('Archipelia joins a session as a player', () => {
  test('joins an open session as an unlisted client, waits for consent, and shows the room once it runs', async () => {
    const { rig, lobby, files, record } = await setUp('0.6.8', { admission: 'open', allowUnlisted: true });
    const joins = startJoins(files, '0.6.8');
    cleanups.push(() => Promise.resolve(joins.service.closeAll()));
    await joins.service.start(record);
    await joins.until((view) => view.state === 'approved' && view.slotState === 'waiting-consent');
    const member = await memberOf(rig, lobby.id);
    expect(member).toMatchObject({ kind: 'client', trust: 'unlisted', client: { id: 'archipelia', name: 'Archipelia', version: '0.1.0', archipelago: '0.6.8' } });
    await rig.service.consent(lobby.id, record.world?.sha256 ?? '', true);
    await joins.until((view) => view.slotState === 'ok');
    await (await rig.service.start(lobby.id)).finished;
    const started = await joins.until((view) => view.state === 'started');
    expect(started.results).toMatchObject({ address: 'archipelago.gg:38281', slot: 'Cy', game: 'Quest', sameComputer: true });
    expect(started.results?.password).toBeTruthy();
    expect(rig.templates[0]?.players.map((player) => player.name)).toEqual(['Cy']);
  }, 30000);

  test('refuses before it sends anything when the session runs another Archipelago version', async () => {
    const { rig, lobby, files, record } = await setUp('0.6.9', { admission: 'open', allowUnlisted: true });
    const joins = startJoins(files, '0.6.8');
    await joins.service.start(record);
    const failed = await joins.until((view) => view.state === 'failed');
    expect(failed.message).toBe('This lobby runs Archipelago 0.6.9. Archipelia 0.1.0 runs Archipelago 0.6.8. Switch to Archipelago 0.6.9 and join again.');
    expect((await rig.service.get(lobby.id))?.members).toEqual([]);
  });

  test('says plainly that a session for listed clients only does not take Archipelia', async () => {
    const { files, record } = await setUp('0.6.8', { admission: 'open', allowUnlisted: false });
    const joins = startJoins(files, '0.6.8');
    await joins.service.start(record);
    expect((await joins.until((view) => view.state === 'failed')).message).toContain('Allow unlisted clients');
  });

  test('keeps its token in its own storage and resumes its place after a restart', async () => {
    const { rig, lobby, files, record } = await setUp('0.6.8', { admission: 'host-approval', allowUnlisted: true });
    const first = startJoins(files, '0.6.8');
    await first.service.start(record);
    const pending = await first.until((view) => view.state === 'pending');
    expect(JSON.stringify(pending)).not.toContain('token');
    const stored = await files.readJson<{ token?: string }[]>('joins.json', []);
    expect(stored[0]?.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    first.service.closeAll();
    const second = startJoins(files, '0.6.8');
    cleanups.push(() => Promise.resolve(second.service.closeAll()));
    await second.service.resumeAll();
    await second.until((view) => view.state === 'pending');
    const member = await memberOf(rig, lobby.id);
    await rig.service.approve(lobby.id, member?.id ?? '');
    await second.until((view) => view.state === 'approved');
    expect((await rig.service.get(lobby.id))?.members.filter((entry) => entry.displayName === 'Cy')).toHaveLength(1);
  }, 30000);
});
