/* @layer tests @kind test */
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { AdminLobby, HostedPlayer, SessionTemplate } from '@archipelia/model';
import type { Bindings, HostLine } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { connectWebSocket, createFakeClient, createScenarioKit, loadScenario } from '@drizztdourden08/archipelia-lobby-protocol/testing';
import { startLobbyRig } from '@archipelia/server/testing';
import { openToNetwork } from '../../electron/sessions/open-to-network';
import { prepareRun } from '../../electron/sessions/prepare-run';
import { runSession } from '../../electron/sessions/run-session';
import { startSession } from '../../electron/sessions/start-session';
import { syncSession } from '../../electron/sessions/sync-session';
import { approvedJoiner, joinRecord, startJoins } from '../lobbies/join-kit';
import { tempFiles } from '../lobbies/temp-files';
import type { LobbyRequest, LobbyServerStatus } from '../../src/lobbies/lobbies.type';
import { launchOf } from '../../src/runs/launch-of';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { actOn, listOn } from '../live/live-kit';
import { startPlan, syncPlan } from './plan-fixtures';
import { runAction } from '../../src/views/SessionLobby/behavior/run-action';

type Rig = Awaited<ReturnType<typeof startLobbyRig>>;

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

const lobbyDeps = (on: Rig) => ({
  act: actOn(on),
  list: listOn(on),
  slotOf: (player: HostedPlayer) =>
    Promise.resolve({ name: player.name, game: player.game, yaml: player.source.kind === 'yaml' ? player.source.yaml : '', worldVersion: '1.0.0' }),
});

const hostSlotNames = (lobby: AdminLobby) => lobby.members.filter((member) => member.kind === 'host').flatMap((member) => member.slots).map((slot) => slot.name);

const started = async (on: Rig, draft: SessionTemplate) => {
  const { lobby } = await startSession(startPlan(draft), lobbyDeps(on));
  return { lobby, template: draft };
};

const hostHook = (on: Rig, template: SessionTemplate, lobbyId: string) => async (line: HostLine, bindings: Bindings) => {
  if (line.action === 'approve') await actOn(on)({ type: 'member.approve', params: { lobbyId, memberId: String(bindings.member) } });
  if (line.action === 'start') await runSession(syncPlan(template, lobbyId), lobbyDeps(on));
};

describe('a session that takes direct connections', () => {
  test('lets a client connect, be approved in the lobby, and run in one seed with a player the host adds later', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const { lobby, template } = await started(on, sessionOf({ direct: DIRECT, players: [] }));
    expect(lobby).toMatchObject({ name: 'Friday seed', phase: 'open', options: { admission: 'host-approval', allowUnlisted: false, room: { kind: 'archipelago-gg' } } });
    const client = createFakeClient({
      scenario: loadScenario('approval-join'), kit: createScenarioKit(), ignore: ['lobby.state'], timeoutMs: 15000,
      connect: () => connectWebSocket(`ws://${on.address}/archipelia/lobby`), host: hostHook(on, { ...template, players: sessionOf().players }, lobby.id),
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
    const { lobby, template } = await started(rig, sessionOf({ direct: DIRECT }));
    await runSession(syncPlan(template, lobby.id), lobbyDeps(rig));
    await expect(runSession(syncPlan(template, lobby.id), lobbyDeps(rig))).rejects.toThrow('Start session opens a new one');
  });

  test('opens the lobby with no player and makes no seed, reuses it on the next start, and refuses Run until a player is ready', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const draft = sessionOf({ players: [], direct: DIRECT });
    const { lobby, template } = await started(on, draft);
    expect(lobby.phase).toBe('open');
    expect(on.templates).toHaveLength(0);
    expect(await startSession(startPlan(template, lobby.id), lobbyDeps(on))).toMatchObject({ lobbyId: lobby.id });
    await expect(runSession(syncPlan(template, lobby.id), lobbyDeps(on))).rejects.toThrow('No player is ready yet');
    await expect(runSession(syncPlan(draft, 'gone'), lobbyDeps(on))).rejects.toThrow('The lobby of this session is gone');
    expect(on.templates).toHaveLength(0);
  });
});

describe('a session without direct connections', () => {
  test('creates its lobby already locked to clients, never open, and runs the players of the host', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const sent: LobbyRequest[] = [];
    const deps = { ...lobbyDeps(on), act: (request: LobbyRequest) => { sent.push(request); return actOn(on)(request); } };
    const beforeRun = vi.fn(() => Promise.resolve());
    const { lobby } = await startSession(startPlan(sessionOf({ host: { kind: 'local', port: 38281 } })), deps);
    expect(sent[0]).toMatchObject({ type: 'lobby.create', params: { locked: true } });
    expect(sent.map((request) => request.type)).not.toContain('lobby.lock');
    expect(lobby.phase).toBe('locked');
    expect(hostSlotNames(lobby)).toEqual(['Ana']);
    const template = sessionOf({ host: { kind: 'local', port: 38281 } });
    await runSession(syncPlan(template, lobby.id), { ...lobbyDeps(on), beforeRun });
    expect(beforeRun).toHaveBeenCalledWith(lobby.id, template);
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
    expect(on.templates[0]?.players.map((player) => player.name)).toEqual(['Ana']);
  });

  test('runs under its lobby on this computer, and on no launch the app follows for a remote server', () => {
    expect(launchOf({ serverId: 'local', lobbyId: 'lb_1' }, 5)).toEqual({ templateId: 'lobby-lb_1', startedAt: 5 });
    expect(launchOf({ serverId: 'srv_1', lobbyId: 'lb_1' }, 5)).toBeNull();
  });
});

describe('the main action of the lobby screen', () => {
  const run = () => undefined;

  test('waits for the lobby, then runs once a player is ready', async () => {
    rig = await startLobbyRig();
    const { lobby } = await started(rig, sessionOf({ players: [], direct: DIRECT }));
    const empty = sessionOf({ players: [], direct: DIRECT });
    expect(runAction(empty, undefined, run).reason).toBe('Loading the lobby');
    expect(runAction(empty, lobby, run).reason).toContain('No player is ready yet');
    expect(runAction({ ...empty, direct: undefined }, lobby, run).reason).toBe('Add at least one player.');
    expect(runAction({ ...empty, players: sessionOf().players }, lobby, run).reason).toBeUndefined();
    expect(runAction(empty, { ...lobby, phase: 'hosting' }, run).reason).toContain('running');
    expect(runAction(empty, { ...lobby, phase: 'hosting' }, run).label).toBe('Run');
  });
});

describe('the slots of the host in a session that takes direct connections', () => {
  test('are reserved, so a client with a host slot name is refused at join, and the run still works', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const draft = sessionOf({ direct: { admission: 'open', allowUnlisted: true }, players: [{ slot: 1, name: 'Cy', game: 'Quest', source: { kind: 'yaml', fileName: 'cy.yaml', yaml: CY_YAML } }] });
    const { lobby, template } = await started(on, draft);
    await syncSession(syncPlan(template, lobby.id), lobbyDeps(on));
    const store = await tempFiles('joins');
    const joins = startJoins(store.files, '0.6.8');
    await joins.service.start(await joinRecord(on.address, lobby.code));
    const failed = await joins.until((view) => view.state === 'failed');
    expect(failed.message).toContain('slot name Cy');
    joins.service.closeAll();
    await store.remove();
    await runSession(syncPlan(template, lobby.id), lobbyDeps(on));
    await vi.waitFor(() => expect(on.templates).toHaveLength(1));
    expect(on.templates[0]?.players.map((player) => player.name)).toEqual(['Cy']);
  }, 30000);
});

describe('turning direct connections off on a lobby with joined players', () => {
  test('removes every joined player before it locks, so none can resume or run', async () => {
    rig = await startLobbyRig();
    const on = rig;
    const { lobby, template } = await started(on, sessionOf({ direct: { admission: 'host-approval', allowUnlisted: true }, players: [] }));
    const joiner = await approvedJoiner(on, lobby);
    const { joinedId } = joiner;
    const closed = await syncSession(syncPlan({ ...template, direct: undefined, players: sessionOf().players }, lobby.id), lobbyDeps(on));
    await joiner.close();
    expect(closed.phase).toBe('locked');
    expect(closed.members.find((member) => member.id === joinedId)?.admission).toBe('removed');
    expect(hostSlotNames(closed)).toEqual(['Ana']);
  }, 30000);
});

const serverAt = (options: Partial<LobbyServerStatus['options']>) => {
  const apply = vi.fn((_options: unknown) => Promise.resolve());
  const status = (): LobbyServerStatus => ({ state: 'listening', options: { mode: 'off', publicLookup: true, ...options }, automation: false, roomPasswords: 'vault', lanAddress: '192.168.1.5' });
  return { server: { status, apply }, apply };
};

describe('what a session opens on the network', () => {
  const lan = sessionOf({ host: { kind: 'local', port: 38281 }, lan: true });

  test('opens the lobby port on LAN only with direct connections, and only after the recorded consent', async () => {
    const consented = serverAt({ lanConsent: true });
    await openToNetwork(consented.server)(lan);
    expect(consented.apply).not.toHaveBeenCalled();
    await openToNetwork(consented.server)({ ...lan, direct: DIRECT });
    expect(consented.apply).toHaveBeenCalledWith(expect.objectContaining({ mode: 'lan' }));
    const asked = serverAt({});
    await expect(openToNetwork(asked.server)(lan)).rejects.toThrow('not open to your network');
    await openToNetwork(asked.server)(sessionOf({ host: { kind: 'local', port: 38281 } }));
    expect(asked.apply).not.toHaveBeenCalled();
  });

  test('opens the room on LAN for a LAN session, and shares only the password the session itself keeps', async () => {
    const sharePassword = vi.fn(() => Promise.resolve());
    const setLanRoom = vi.fn();
    const before = prepareRun({ server: serverAt({ lanConsent: true }).server, setLanRoom, sharePassword });
    const forged = { ...lan, server: { ...lan.server, passwordRef: 'ssh-password-box' } };
    await before('lb_1', forged);
    expect(setLanRoom).toHaveBeenCalledWith('lb_1', true);
    expect(sharePassword).toHaveBeenCalledWith('lb_1', 'room-password-t1');
    expect(sharePassword).not.toHaveBeenCalledWith('lb_1', 'ssh-password-box');
    await before('lb_2', sessionOf({ host: { kind: 'local', port: 38281 }, lobby: { serverId: 'r1' } }));
    expect(sharePassword).toHaveBeenCalledTimes(1);
    await expect(prepareRun({ server: serverAt({}).server, setLanRoom, sharePassword })('lb_3', lan)).rejects.toThrow('not open to your network');
  });
});
