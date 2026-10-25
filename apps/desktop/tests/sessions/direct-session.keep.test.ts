/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { AdminLobby, SessionTemplate } from '@archipelia/model';
import type { Bindings, HostLine } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, createScenarioKit, loadScenario } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { startLobbyRig } from '@archipelia/server/testing';
import { runDirect } from '../../electron/sessions/run-direct';
import { syncDirect } from '../../electron/sessions/sync-direct';
import { joinRecord, startJoins } from '../lobbies/join-kit';
import { tempFiles } from '../lobbies/temp-files';
import type { LobbyRequest } from '../../src/lobbies/lobbies.type';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { launchOf } from '../../src/runs/launch-of';
import { validateTemplate } from '../../src/views/SessionBuilder/behavior/template-validation';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

const ENGINE = { id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.0' };

const DIRECT = { admission: 'host-approval', allowUnlisted: false } as const;

const CY_YAML = ['name: Cy', 'game: Quest', ''].join('\n');

let rig: Rig | undefined;

afterEach(async () => {
  await rig?.stop();
  rig = undefined;
});

const sessionOf = (): SessionTemplate => ({
  ...newTemplate('t1'),
  name: 'Friday seed',
  host: { kind: 'archipelago-gg' },
  players: [{ slot: 1, name: 'Ana', game: 'A Link to the Past', source: { kind: 'yaml', fileName: 'ana.yaml', yaml: 'name: Ana\ngame: A Link to the Past\n' } }],
});

const actOn = (on: Rig) => async (request: LobbyRequest) => (await on.call(request.type, request.params)) as AdminLobby;

const directDeps = (on: Rig) => ({
  act: actOn(on),
  list: async () => (await on.call('lobby.list')) as AdminLobby[],
  slotOf: (player: SessionTemplate['players'][number]) =>
    Promise.resolve({ name: player.name, game: player.game, yaml: player.source.kind === 'yaml' ? player.source.yaml : '', worldVersion: '1.0.0' }),
});

const openSession = async (on: Rig) => {
  const draft = sessionOf();
  const request = lobbyRequest.open(draft, DIRECT);
  const lobby = await actOn(on)({ ...request, params: { ...request.params, engine: ENGINE } });
  return { lobby, template: { ...draft, direct: { serverId: 'local', lobbyId: lobby.id, ...DIRECT } } };
};

const hostHook = (on: Rig, template: SessionTemplate) => async (line: HostLine, bindings: Bindings) => {
  const lobbyId = template.direct?.lobbyId ?? '';
  if (line.action === 'approve') await actOn(on)(lobbyRequest.approve(lobbyId, String(bindings.member)));
  if (line.action === 'start') await runDirect(template, directDeps(on));
};

describe('a session that takes direct connections', () => {
  test('lets a client connect, be approved in the session, and run in one seed with the host player', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const { lobby, template } = await openSession(on);
    expect(lobby).toMatchObject({ name: 'Friday seed', options: { admission: 'host-approval', allowUnlisted: false, room: { kind: 'archipelago-gg' } } });
    const client = createFakeClient({
      scenario: loadScenario('approval-join'), kit: createScenarioKit(), ignore: ['lobby.state'], timeoutMs: 15000,
      connect: () => connectWebSocket(`ws://${on.address}/archipelia/lobby`), host: hostHook(on, template),
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
    const { template } = await openSession(rig);
    await runDirect(template, directDeps(rig));
    await expect(runDirect(template, directDeps(rig))).rejects.toThrow('Turn Allow direct connection off and on again');
  });
});

describe('the slots of the host in a session that takes direct connections', () => {
  test('are reserved, so a client with a host slot name is refused at join, and the run still works', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const options = { admission: 'open', allowUnlisted: true } as const;
    const draft = { ...sessionOf(), players: [{ slot: 1, name: 'Cy', game: 'Quest', source: { kind: 'yaml', fileName: 'cy.yaml', yaml: CY_YAML } } as const] };
    const request = lobbyRequest.open(draft, options);
    const lobby = await actOn(on)({ ...request, params: { ...request.params, engine: ENGINE } });
    const template = { ...draft, direct: { serverId: 'local', lobbyId: lobby.id, ...options } };
    await syncDirect(template, directDeps(on));
    const store = await tempFiles('joins');
    const joins = startJoins(store.files, '0.6.8');
    await joins.service.start(await joinRecord(on.address, lobby.code));
    const failed = await joins.until((view) => view.state === 'failed');
    expect(failed.message).toContain('slot name Cy');
    joins.service.closeAll();
    await store.remove();
    await runDirect(template, directDeps(on));
    await vi.waitFor(() => expect(on.templates[0]?.players.map((player) => player.name)).toEqual(['Cy']));
  }, 30000);
});

describe('a session without direct connection', () => {
  test('still needs a player and runs under its own id, while a direct one may start empty and runs under its lobby', () => {
    const empty = { ...sessionOf(), players: [] };
    const library = { installed: [], presets: [] };
    expect(validateTemplate(empty, library).map((problem) => problem.field)).toContain('players');
    expect(validateTemplate({ ...empty, direct: { serverId: 'local', lobbyId: 'lb_1', ...DIRECT } }, library).map((problem) => problem.field)).not.toContain('players');
    expect(launchOf(empty, 5)).toEqual({ templateId: 't1', startedAt: 5 });
    expect(launchOf({ ...empty, direct: { serverId: 'local', lobbyId: 'lb_1', ...DIRECT } }, 5)).toEqual({ templateId: 'lobby-lb_1', startedAt: 5 });
    expect(launchOf({ ...empty, direct: { serverId: 'srv_1', lobbyId: 'lb_1', ...DIRECT } }, 5)).toBeNull();
  });
});
