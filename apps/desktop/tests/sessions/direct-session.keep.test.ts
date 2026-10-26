/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import type { Bindings, HostLine } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, createScenarioKit, loadScenario } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { startLobbyRig } from '@archipelia/server/testing';
import { runSession } from '../../electron/sessions/run-session';
import { startSession } from '../../electron/sessions/start-session';
import { syncSession } from '../../electron/sessions/sync-session';
import { joinRecord, startJoins } from '../lobbies/join-kit';
import { tempFiles } from '../lobbies/temp-files';
import type { LobbyRequest } from '../../src/lobbies/lobbies.type';
import { launchOf } from '../../src/runs/launch-of';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { runAction } from '../../src/views/SessionLobby/behavior/run-action';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

const ENGINE = { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' };

const DIRECT = { admission: 'host-approval', allowUnlisted: false } as const;

const CY_YAML = ['name: Cy', 'game: Quest', ''].join('\n');

let rig: Rig | undefined;

afterEach(async () => {
  await rig?.stop();
  rig = undefined;
});

const sessionOf = (patch: Partial<SessionTemplate> = {}): SessionTemplate => ({
  ...newTemplate('t1'),
  name: 'Friday seed',
  host: { kind: 'archipelago-gg' },
  players: [{ slot: 1, name: 'Ana', game: 'A Link to the Past', source: { kind: 'yaml', fileName: 'ana.yaml', yaml: 'name: Ana\ngame: A Link to the Past\n' } }],
  ...patch,
});

const actOn = (on: Rig) => async (request: LobbyRequest) => {
  const params = request.type === 'lobby.create' ? { ...request.params, engine: ENGINE } : request.params;
  return (await on.call(request.type, params)) as AdminLobby;
};

const lobbyDeps = (on: Rig) => ({
  act: actOn(on),
  list: async () => (await on.call('lobby.list')) as AdminLobby[],
  slotOf: (player: SessionTemplate['players'][number]) =>
    Promise.resolve({ name: player.name, game: player.game, yaml: player.source.kind === 'yaml' ? player.source.yaml : '', worldVersion: '1.0.0' }),
});

const hostSlotNames = (lobby: AdminLobby) => lobby.members.filter((member) => member.kind === 'host').flatMap((member) => member.slots).map((slot) => slot.name);

const started = async (on: Rig, draft: SessionTemplate) => {
  const lobby = await startSession(draft, lobbyDeps(on));
  return { lobby, template: { ...draft, lobby: { serverId: 'local', lobbyId: lobby.id } } };
};

const hostHook = (on: Rig, template: SessionTemplate) => async (line: HostLine, bindings: Bindings) => {
  const lobbyId = template.lobby?.lobbyId ?? '';
  if (line.action === 'approve') await actOn(on)({ type: 'member.approve', params: { lobbyId, memberId: String(bindings.member) } });
  if (line.action === 'start') await runSession(template, lobbyDeps(on));
};

describe('a session that takes direct connections', () => {
  test('lets a client connect, be approved in the lobby, and run in one seed with a player the host adds later', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const { lobby, template } = await started(on, sessionOf({ direct: DIRECT, players: [] }));
    expect(lobby).toMatchObject({ name: 'Friday seed', phase: 'open', options: { admission: 'host-approval', allowUnlisted: false, room: { kind: 'archipelago-gg' } } });
    const client = createFakeClient({
      scenario: loadScenario('approval-join'), kit: createScenarioKit(), ignore: ['lobby.state'], timeoutMs: 15000,
      connect: () => connectWebSocket(`ws://${on.address}/archipelia/lobby`), host: hostHook(on, { ...template, players: sessionOf().players }),
    });
    const result = await client.play();
    expect(result.failure).toBeUndefined();
    const players = on.templates[0]?.players.map((player) => player.name);
    expect(players).toEqual(expect.arrayContaining(['Link', 'Ana']));
    expect(players).toHaveLength(2);
    const ran = (await on.service.get(lobby.id))?.members.find((member) => member.displayName === 'Link');
    expect(ran).toMatchObject({ kind: 'client', admission: 'approved', trust: 'verified', client: { name: 'Relic of the Past', version: '0.22.0' } });
  }, 30000);

  test('refuses a second run on a lobby that already ran, and names the way out', async () => {
    rig = await startLobbyRig();
    const { template } = await started(rig, sessionOf({ direct: DIRECT }));
    await runSession(template, lobbyDeps(rig));
    await expect(runSession(template, lobbyDeps(rig))).rejects.toThrow('Start session opens a new one');
  });

  test('opens the lobby with no player and makes no seed, reuses it on the next start, and refuses Run until a player is ready', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const draft = sessionOf({ players: [], direct: DIRECT });
    const { lobby, template } = await started(on, draft);
    expect(lobby.phase).toBe('open');
    expect(on.templates).toHaveLength(0);
    expect(await startSession(template, lobbyDeps(on))).toMatchObject({ id: lobby.id });
    await expect(runSession(template, lobbyDeps(on))).rejects.toThrow('No player is ready yet');
    await expect(runSession(draft, lobbyDeps(on))).rejects.toThrow('This session is not started yet');
    expect(on.templates).toHaveLength(0);
  });
});

describe('a session without direct connections', () => {
  test('still opens a lobby on Start session, locked to clients, and runs the players of the host', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const sharePassword = vi.fn(() => Promise.resolve());
    const { lobby, template } = await started(on, sessionOf({ host: { kind: 'local', port: 38281 }, server: { ...sessionOf().server, passwordRef: 'room-password-t1' } }));
    expect(lobby.phase).toBe('locked');
    expect(hostSlotNames(lobby)).toEqual(['Ana']);
    await runSession(template, { ...lobbyDeps(on), sharePassword });
    expect(sharePassword).toHaveBeenCalledWith(lobby.id, 'room-password-t1');
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
    expect(on.templates[0]?.players.map((player) => player.name)).toEqual(['Ana']);
  });

  test('runs under its lobby on this computer, and on no launch the app follows for a remote server', () => {
    expect(launchOf(sessionOf({ lobby: { serverId: 'local', lobbyId: 'lb_1' } }), 5)).toEqual({ templateId: 'lobby-lb_1', startedAt: 5 });
    expect(launchOf(sessionOf({ lobby: { serverId: 'srv_1', lobbyId: 'lb_1' } }), 5)).toBeNull();
    expect(launchOf(sessionOf(), 5)).toBeNull();
  });
});

describe('the main action of the lobby screen', () => {
  const handlers = { run: () => undefined, start: () => undefined };

  test('starts the session first, then runs once a player is ready', async () => {
    rig = await startLobbyRig();
    const { lobby } = await started(rig, sessionOf({ players: [], direct: DIRECT }));
    const empty = sessionOf({ players: [], direct: DIRECT });
    const live = { ...empty, lobby: { serverId: 'local', lobbyId: lobby.id } };
    expect(runAction(empty, undefined, handlers)).toEqual({ label: 'Start session', onClick: handlers.start });
    expect(runAction(live, undefined, handlers).reason).toBe('Loading the lobby');
    expect(runAction(live, [lobby], handlers).reason).toContain('No player is ready yet');
    expect(runAction({ ...live, direct: undefined }, [lobby], handlers).reason).toBe('Add at least one player.');
    expect(runAction({ ...live, players: sessionOf().players }, [lobby], handlers).reason).toBeUndefined();
    expect(runAction(live, [{ ...lobby, phase: 'hosting' }], handlers).reason).toContain('running');
    expect(runAction(live, [{ ...lobby, phase: 'closed' }], handlers).label).toBe('Start session');
    expect(runAction({ ...live, lobby: { serverId: 'local', lobbyId: 'gone' } }, [lobby], handlers).label).toBe('Start session');
  });
});

describe('the slots of the host in a session that takes direct connections', () => {
  test('are reserved, so a client with a host slot name is refused at join, and the run still works', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const draft = sessionOf({ direct: { admission: 'open', allowUnlisted: true }, players: [{ slot: 1, name: 'Cy', game: 'Quest', source: { kind: 'yaml', fileName: 'cy.yaml', yaml: CY_YAML } }] });
    const { lobby, template } = await started(on, draft);
    await syncSession(template, lobbyDeps(on));
    const store = await tempFiles('joins');
    const joins = startJoins(store.files, '0.6.8');
    await joins.service.start(await joinRecord(on.address, lobby.code));
    const failed = await joins.until((view) => view.state === 'failed');
    expect(failed.message).toContain('slot name Cy');
    joins.service.closeAll();
    await store.remove();
    await runSession(template, lobbyDeps(on));
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
    expect(on.templates[0]?.players.map((player) => player.name)).toEqual(['Cy']);
  }, 30000);
});
