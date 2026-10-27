/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { approvedJoiner } from '../lobbies/join-kit';
import { listOn, liveSuite, playerOf, sessionOf } from './live-kit';

const { kitOn, cleanups, stopRig } = liveSuite();

const DIRECT = { admission: 'host-approval', allowUnlisted: true } as const;

describe('run by tab id', () => {
  test('builds the run from the saved session and the tab overrides, and the run record carries the source and the origin of each player', async () => {
    const { live, rig: on, saved } = await kitOn();
    const { tab } = await live.start('t1', { server: { hintCost: 5 }, players: [playerOf(1, 'Ana'), playerOf(2, 'Bob')] });
    saved.set('t1', { ...sessionOf(), name: 'Friday renamed' });
    await live.run(tab.tabId);
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
    expect(on.templates[0]).toMatchObject({ server: { hintCost: 5 }, players: [{ name: 'Ana' }, { name: 'Bob' }] });
    const [record] = on.lobbyRuns;
    expect(record?.source).toMatchObject({ sessionId: 't1', overrides: [{ field: 'server.hintCost' }, { field: 'players.Bob' }] });
    expect(record?.players?.map((player) => [player.name, player.origin])).toEqual([['Ana', 'saved'], ['Bob', 'added']]);
    expect((await live.list())[0]?.changes.map((change) => change.field)).toEqual(['server.hintCost', 'players.Bob']);
  });

  test('refuses a tab it does not hold, a session that was deleted, a session moved elsewhere and a setup with a problem', async () => {
    const { live, saved } = await kitOn();
    await expect(live.run('forged')).rejects.toThrow('no open tab');
    const { tab } = await live.start('t1');
    saved.set('t1', sessionOf({ lobby: { serverId: 'r1' } }));
    await expect(live.run(tab.tabId)).rejects.toThrow('Where changed');
    saved.set('t1', sessionOf({ players: [playerOf(1, 'Ana'), playerOf(2, 'Ana')] }));
    await expect(live.run(tab.tabId)).rejects.toThrow('Two players are named Ana');
    saved.delete('t1');
    await expect(live.run(tab.tabId)).rejects.toThrow('saved session of this tab is gone');
  });

  test('refuses a second run on a lobby that already ran', async () => {
    const { live, rig: on } = await kitOn();
    const { tab } = await live.start('t1');
    await live.run(tab.tabId);
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
    await expect(live.run(tab.tabId)).rejects.toThrow('already ran');
  });
});

describe('the four security fixes, asserted in main from the id', () => {
  test('LAN consent is asserted before the lobby opens and before it runs', async () => {
    const withoutConsent = await kitOn({ saved: [sessionOf({ lan: true })], consent: false });
    await expect(withoutConsent.live.start('t1')).rejects.toThrow('not open to your network');
    expect(withoutConsent.sent).toEqual([]);
    expect(await withoutConsent.live.list()).toEqual([]);
    await stopRig();
    const revoked = await kitOn({ saved: [sessionOf({ lan: true })] });
    const { tab } = await revoked.live.start('t1');
    revoked.network.revoke();
    await expect(revoked.live.run(tab.tabId)).rejects.toThrow('not open to your network');
    expect((await listOn(revoked.rig)())[0]?.phase).toBe('locked');
    expect(revoked.rig.templates).toEqual([]);
  });

  test('a LAN override cannot skip the consent either', async () => {
    const { live, sent } = await kitOn({ consent: false });
    await expect(live.start('t1', { lan: true })).rejects.toThrow('not open to your network');
    expect(sent).toEqual([]);
  });

  test('the room password reference is derived from the session id, never taken from the saved record or an override', async () => {
    const forged = sessionOf({ server: { ...sessionOf().server, passwordRef: 'ssh-password-box' } });
    const { live, sharePassword } = await kitOn({ saved: [forged] });
    await expect(live.start('t1', { server: { passwordRef: 'ssh-password-box' } })).rejects.toThrow('server.passwordRef is not allowed');
    const { tab, lobby } = await live.start('t1');
    await live.run(tab.tabId);
    expect(sharePassword).toHaveBeenCalledTimes(1);
    expect(sharePassword).toHaveBeenCalledWith(lobby.id, 'room-password-t1');
  });

  test('a lobby without direct connections is created locked, and one with them is created open', async () => {
    const closedDoor = await kitOn();
    const first = await closedDoor.live.start('t1');
    expect(closedDoor.sent[0]).toMatchObject({ type: 'lobby.create', params: { locked: true } });
    expect(first.lobby.phase).toBe('locked');
    await stopRig();
    const withDirect = await kitOn({ saved: [sessionOf({ direct: DIRECT })] });
    const second = await withDirect.live.start('t1');
    expect(withDirect.sent[0]?.params).not.toHaveProperty('locked');
    expect(second.lobby.phase).toBe('open');
  });

  test('turning direct off on a live tab removes every joined player, then locks', async () => {
    const { live, rig: on } = await kitOn({ saved: [sessionOf({ direct: DIRECT, players: [] })] });
    const { lobby } = await live.start('t1');
    const joiner = await approvedJoiner(on, lobby);
    cleanups.push(joiner.close);
    const { joinedId } = joiner;
    const closed = await live.start('t1', { direct: null, players: [playerOf(1, 'Ana')] });
    expect(closed.tab.direct).toBe(false);
    expect(closed.lobby.phase).toBe('locked');
    expect(closed.lobby.members.find((member) => member.id === joinedId)?.admission).toBe('removed');
  }, 30000);
});

describe('turning direct on and off on a live tab', () => {
  const LAN_DIRECT = { lan: true, direct: DIRECT };

  test('goes quiet on the network once no open tab is both LAN and direct, and only then', async () => {
    const { live, quiet } = await kitOn({ saved: [sessionOf(LAN_DIRECT)] });
    await live.start('t1');
    await live.start('t1', { players: [playerOf(1, 'Ana'), playerOf(2, 'Bob')] });
    expect(quiet).not.toHaveBeenCalled();
    const off = await live.start('t1', { direct: null });
    expect(off.tab).toMatchObject({ lan: true, direct: false });
    expect(quiet).toHaveBeenCalledTimes(1);
    await live.start('t1', { direct: null, server: { hintCost: 3 } });
    expect(quiet).toHaveBeenCalledTimes(1);
  });

  test('opens a lobby that was created locked when direct is turned on, and locks it again when it is turned off', async () => {
    const { live, sent } = await kitOn();
    const first = await live.start('t1');
    expect(first.lobby.phase).toBe('locked');
    const on = await live.start('t1', { direct: DIRECT });
    expect(on.lobby.phase).toBe('open');
    expect(on.lobby.options).toMatchObject({ admission: 'host-approval', allowUnlisted: true });
    expect(sent.map((request) => request.type)).toContain('lobby.unlock');
    expect((await live.start('t1', { direct: null })).lobby.phase).toBe('locked');
  });

  test('needs the LAN consent before it opens a locked lobby to the network', async () => {
    const { live, network, rig: on } = await kitOn({ saved: [sessionOf({ lan: true })] });
    await live.start('t1');
    network.revoke();
    await expect(live.start('t1', { direct: DIRECT })).rejects.toThrow('not open to your network');
    expect((await listOn(on)())[0]?.phase).toBe('locked');
  });

  test('never restarts the network listener for a lobby that is already open, so joined players stay connected', async () => {
    const { live, network } = await kitOn({ saved: [sessionOf(LAN_DIRECT)] });
    const { tab } = await live.start('t1');
    await network.server.apply({ ...network.server.status().options, mode: 'off' });
    network.apply.mockClear();
    await live.start('t1');
    await live.run(tab.tabId);
    expect(network.apply).not.toHaveBeenCalled();
  });

  test('refuses to unlock a lobby that is not locked', async () => {
    const { live, rig: on } = await kitOn({ saved: [sessionOf({ direct: DIRECT })] });
    const { lobby } = await live.start('t1');
    await expect(on.call('lobby.unlock', { lobbyId: lobby.id })).rejects.toThrow('cannot unlock');
  });
});

describe('the preset settings in the players override', () => {
  const preset = (overrides: Record<string, unknown>, game = 'Demo') =>
    ({ players: [{ slot: 1, name: 'Dee', game, source: { kind: 'preset', presetId: 'p1', overrides } }] });

  test('may only name options that exist in the schema of the game', async () => {
    const { live, rig: on } = await kitOn();
    await expect(live.start('t1', preset({ not_an_option: 1 }))).rejects.toThrow('Dee has a setting not_an_option that its game does not have');
    await expect(live.start('t1', preset({ death_link: true }, 'Missing'))).rejects.toThrow('Missing is not installed');
    expect(await listOn(on)()).toEqual([]);
    const { tab } = await live.start('t1', preset({ death_link: true, crystals: 3 }));
    expect(tab.overrides.players?.[0]?.name).toBe('Dee');
  });
});

describe('two runs of one tab that arrive together', () => {
  test('share one run, never a second start of the lobby', async () => {
    const { live, rig: on } = await kitOn();
    const { tab } = await live.start('t1');
    const [one, two] = await Promise.all([live.run(tab.tabId), live.run(tab.tabId)]);
    expect(one.id).toBe(two.id);
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
  });
});

describe('close by tab id', () => {
  test('closes the lobby through the pending closes and drops the tab', async () => {
    const { live, closed } = await kitOn();
    const { tab } = await live.start('t1');
    await expect(live.close(tab.tabId, 'everything')).rejects.toThrow('lobby, room or run');
    expect(await live.close(tab.tabId, 'lobby')).toEqual({ closed: true });
    expect(closed).toEqual([{ templateId: 't1', serverId: 'local', lobbyId: tab.lobbyId }]);
    expect(await live.list()).toEqual([]);
    await expect(live.close(tab.tabId, 'lobby')).rejects.toThrow('no open tab');
  });

  test('asks to stop the room first while the lobby hosts, and closes it with the room mode', async () => {
    const { live, closed, rig: on } = await kitOn();
    const { tab } = await live.start('t1');
    await live.run(tab.tabId);
    await vi.waitFor(async () => expect((await listOn(on)())[0]?.phase).toBe('hosting'));
    await expect(live.close(tab.tabId, 'lobby')).rejects.toThrow('Stop the room or cancel the run first');
    expect(closed).toEqual([]);
    expect(await live.close(tab.tabId, 'room')).toEqual({ closed: true });
    expect(await live.list()).toEqual([]);
  });

  test('deleting a session closes the lobby of its tab', async () => {
    const { live, closed } = await kitOn();
    const { tab } = await live.start('t1');
    await live.dropSession('t1');
    expect(closed).toEqual([{ templateId: 't1', serverId: 'local', lobbyId: tab.lobbyId }]);
    expect(await live.list()).toEqual([]);
    await live.dropSession('t1');
  });
});
