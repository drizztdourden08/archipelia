/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Bindings, HostLine } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, createScenarioKit, loadScenario } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import type { Lobby } from '@archipelia/model';
import { startLobbyRig } from '../../src/testing';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

const ENGINE = { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' };

const SOURCE = {
  sessionId: 's1', sessionName: 'Sunday run',
  overrides: [{ field: 'server.hintCost', label: 'Hint cost', from: '10', to: '5' }, { field: 'players.Bob', label: 'Player Bob', from: '', to: 'Demo, preset default' }],
};

const slot = (name: string, origin?: string) => ({ name, game: 'A Link to the Past', yaml: `name: ${name}\ngame: A Link to the Past\n`, worldVersion: '1.0.0', ...(origin ? { origin } : {}) });

let rig: Rig | undefined;

afterEach(async () => {
  await rig?.stop();
  rig = undefined;
});

const created = async (on: Rig, extra: Record<string, unknown> = {}) =>
  (await on.call('lobby.create', { name: 'Sunday run', engine: ENGINE, ...extra })) as Lobby;

describe('the source and the slot origin of an admin lobby', () => {
  test('are stored on create and update, and the host slots keep their origin', async () => {
    rig = await startLobbyRig();
    const lobby = await created(rig, { source: SOURCE });
    expect(lobby.source).toEqual(SOURCE);
    const next = { ...SOURCE, overrides: [] };
    expect(((await rig.call('lobby.update', { lobbyId: lobby.id, source: next })) as Lobby).source).toEqual(next);
    const hosted = (await rig.call('member.host', { lobbyId: lobby.id, displayName: 'Host', slots: [slot('Ana', 'saved'), slot('Bob', 'added'), slot('Cy')] })) as Lobby;
    expect(hosted.members.flatMap((member) => member.slots).map((entry) => [entry.name, entry.origin])).toEqual([['Ana', 'saved'], ['Bob', 'added'], ['Cy', undefined]]);
  });

  test('refuse a source with an unknown key, a wrong type or too many changes, and an origin that is not saved or added', async () => {
    rig = await startLobbyRig();
    await expect(created(rig, { source: { ...SOURCE, extra: 1 } })).rejects.toThrow('source does not take extra');
    await expect(created(rig, { source: { ...SOURCE, sessionId: 4 } })).rejects.toThrow('source.sessionId');
    await expect(created(rig, { source: { ...SOURCE, overrides: [{ field: 'a', label: 'b', from: 1, to: '' }] } })).rejects.toThrow('source.overrides[0].from');
    await expect(created(rig, { source: { ...SOURCE, overrides: Array.from({ length: 101 }, () => ({ field: 'a', label: 'b', from: '', to: '' })) } })).rejects.toThrow('at most 100');
    const lobby = await created(rig);
    expect(lobby.source).toBeUndefined();
    await expect(rig.call('member.host', { lobbyId: lobby.id, displayName: 'Host', slots: [slot('Ana', 'joined')] })).rejects.toThrow('saved or added');
  });
});

describe('the run of a lobby', () => {
  test('gets the source of its lobby and the origin of each slot, with joined players tagged joined', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const lobby = await created(on, { name: 'Friday seed', source: SOURCE, options: { room: { kind: 'archipelago-gg' } } });
    const hook = async (line: HostLine, bindings: Bindings) => {
      if (line.action === 'approve') await on.call('member.approve', { lobbyId: lobby.id, memberId: String(bindings.member) });
      if (line.action !== 'start') return;
      await on.call('member.host', { lobbyId: lobby.id, displayName: 'Host', slots: [slot('Ana', 'saved'), slot('Bob', 'added')] });
      await on.call('lobby.start', { lobbyId: lobby.id });
    };
    const client = createFakeClient({
      scenario: loadScenario('approval-join'), kit: createScenarioKit(), ignore: ['lobby.state'], timeoutMs: 15000,
      connect: () => connectWebSocket(`ws://${on.address}/archipelia/lobby`), host: hook,
    });
    expect((await client.play()).failure).toBeUndefined();
    await vi.waitFor(() => expect(on.lobbyRuns).toHaveLength(1));
    const run = on.lobbyRuns[0];
    expect(run?.source).toEqual(SOURCE);
    const players = run?.players ?? [];
    expect(players.map((player) => [player.name, player.origin])).toEqual(expect.arrayContaining([['Ana', 'saved'], ['Bob', 'added'], ['Link', 'joined']]));
    expect(players).toHaveLength(3);
    expect(players.find((player) => player.name === 'Link')?.member).toMatchObject({ displayName: 'Link', client: 'Relic of the Past', trust: 'verified' });
    expect(players.find((player) => player.name === 'Ana')?.member).toBeUndefined();
    expect(new Set(players.map((player) => player.slot)).size).toBe(3);
  }, 30000);

  test('has no source when the lobby has none', async () => {
    rig = await startLobbyRig();
    const lobby = await created(rig);
    await rig.call('member.host', { lobbyId: lobby.id, displayName: 'Host', slots: [slot('Ana')] });
    await rig.call('lobby.start', { lobbyId: lobby.id });
    await vi.waitFor(() => expect(rig?.lobbyRuns).toHaveLength(1));
    expect(rig.lobbyRuns[0]?.source).toBeUndefined();
    expect(rig.lobbyRuns[0]?.players).toEqual([{ slot: 1, name: 'Ana', game: 'A Link to the Past' }]);
  });
});
