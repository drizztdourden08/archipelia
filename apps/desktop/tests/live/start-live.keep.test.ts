/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { listOn, liveSuite, playerOf, sessionOf } from './live-kit';

const { kitOn } = liveSuite();

const hostedSlots = (lobby: { members: { kind: string; slots: { name: string; origin?: string }[] }[] }) =>
  lobby.members.filter((member) => member.kind === 'host').flatMap((member) => member.slots.map((slot) => [slot.name, slot.origin]));

describe('start by session id', () => {
  test('loads the saved session, applies the allowed overrides, and records what changed on the lobby and the tab', async () => {
    const { live, saved, rig: on } = await kitOn();
    const { tab, lobby } = await live.start('t1', { server: { hintCost: 5 }, players: [playerOf(1, 'Ana'), playerOf(2, 'Bob')] });
    expect(tab).toMatchObject({ sessionId: 't1', serverId: 'local', lobbyId: lobby.id, lan: false, direct: false });
    expect(tab.changes.map((change) => change.field)).toEqual(['server.hintCost', 'players.Bob']);
    expect(lobby.options.server.hintCost).toBe(5);
    expect(lobby.source).toEqual({ sessionId: 't1', sessionName: 'Friday seed', overrides: tab.changes });
    expect(hostedSlots((await listOn(on)())[0] ?? lobby)).toEqual([['Ana', 'saved'], ['Bob', 'added']]);
    expect(saved.get('t1')?.server.hintCost).toBe(10);
    expect(saved.get('t1')?.players).toHaveLength(1);
  });

  test('refuses an override that is not on the allowed list or has a wrong value, and opens nothing', async () => {
    const { live, rig: on } = await kitOn();
    const refused: [unknown, string][] = [
      [{ id: 'other' }, 'The override id is not allowed'],
      [{ name: 'Renamed' }, 'The override name is not allowed'],
      [{ host: { kind: 'local', port: 1 } }, 'The override host is not allowed'],
      [{ lobby: { serverId: 'r1' } }, 'The override lobby is not allowed'],
      [{ server: { passwordRef: 'ssh-password-box' } }, 'The override server.passwordRef is not allowed'],
      [{ server: { hintCost: '5' } }, 'The override server.hintCost has a wrong value'],
      [{ server: { hintCost: 1000 } }, 'The override server.hintCost has a wrong value'],
      [{ generator: { spoiler: 9 } }, 'The override generator.spoiler has a wrong value'],
      [{ direct: { admission: 'open' } }, 'The override direct.allowUnlisted has a wrong value'],
      [{ lan: 'yes' }, 'The override lan has a wrong value'],
      [{ players: [{ ...playerOf(1, 'Ana'), extra: 1 }] }, 'The override players[0].extra is not allowed'],
      [{ players: 'Ana' }, 'The override players has a wrong value'],
      ['all', 'The override overrides has a wrong value'],
    ];
    for (const [raw, message] of refused) await expect(live.start('t1', raw)).rejects.toThrow(message);
    expect(await listOn(on)()).toEqual([]);
    expect(await live.list()).toEqual([]);
  });

  test('refuses an id the main process does not hold, whatever the renderer sends in its place', async () => {
    const { live, rig: on } = await kitOn();
    await expect(live.start('forged')).rejects.toThrow('not saved');
    await expect(live.start({ ...sessionOf({ id: 'forged' }) } as never)).rejects.toThrow('not saved');
    await expect(live.start('t1', { lan: true, direct: null, players: [] })).resolves.toMatchObject({ tab: { sessionId: 't1' } });
    expect((await listOn(on)()).length).toBe(1);
  });

});

describe('start by session id, twice', () => {
  test('returns the tab the session already has, never a second one, and keeps its overrides when none are given', async () => {
    const { live, rig: on } = await kitOn();
    const first = await live.start('t1', { server: { hintCost: 5 } });
    const again = await live.start('t1');
    expect(again.tab).toEqual(first.tab);
    expect(again.lobby.id).toBe(first.lobby.id);
    expect(await live.list()).toHaveLength(1);
    expect(await listOn(on)()).toHaveLength(1);
    const reset = await live.start('t1', {});
    expect(reset.tab).toMatchObject({ tabId: first.tab.tabId, lobbyId: first.tab.lobbyId, overrides: {}, changes: [] });
    expect(reset.lobby.options.server.hintCost).toBe(10);
  });

  test('joins two starts of one session that arrive together into one tab', async () => {
    const { live, rig: on } = await kitOn();
    const [one, two] = await Promise.all([live.start('t1'), live.start('t1')]);
    expect(one.tab.tabId).toBe(two.tab.tabId);
    expect(await listOn(on)()).toHaveLength(1);
  });

  test('refuses a session whose setup has a problem', async () => {
    const { live } = await kitOn({ saved: [sessionOf({ name: ' ' })] });
    await expect(live.start('t1')).rejects.toThrow('The session needs a name');
  });
});

describe('the tabs in the store', () => {
  test('survive a reload of the main process, and tell the renderer on every change', async () => {
    const { live, store, files, events } = await kitOn();
    const { tab } = await live.start('t1');
    const { createLiveSessions } = await import('../../electron/live/create-live-sessions');
    const reloaded = createLiveSessions({ files: files.files, emit: () => undefined });
    expect(await reloaded.list()).toEqual([tab]);
    expect(await reloaded.forSession('t1')).toEqual(tab);
    expect(events.at(-1)).toEqual([tab]);
    await store.attachRun(tab.lobbyId, 'run-1');
    await store.attachRun(tab.lobbyId, 'run-1');
    expect(events).toHaveLength(2);
    expect((await reloaded.get(tab.tabId))?.runId).toBe('run-1');
    await store.remove(tab.tabId);
    expect(await reloaded.list()).toEqual([]);
    expect(events.at(-1)).toEqual([]);
  });
});
