/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { Hello, ServerMessage, WorldEntry } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import { createLobbyService } from '../../src/lobby/create-lobby-service';
import type { LobbyTrust, OverlayInput } from '../../src/lobby/lobby-service.type';
import { createLobbyStore } from '../../src/lobby/store/create-lobby-store';
import { createNodeDomains } from '../../src/node';
import { createBwrapRunner } from '../../src/sandbox/create-bwrap-runner';
import { BASIC_FEATURES } from '../../src/sandbox/sandbox.constants';
import type { SandboxRunner } from '../../src/sandbox/sandbox.type';
import { engine, fileOf, helloOf, holdFiles, linkOf, tick } from './security-kit';
import { fakeTrust, testDeps } from '../../src/testing';

type GateOptions = { sandbox?: SandboxRunner; trust?: LobbyTrust };

const QUEST = { id: 'quest-client', name: 'Quest Client', version: '1.0.0', platform: { os: 'linux' as const, arch: 'x64' as const } };

const worldOf = (name: string, game: string, module: string): WorldEntry => {
  const file = fileOf(name);
  return { game, module, worldVersion: game === 'Unlisted Quest' ? '1.0.0' : '0.1.0', sha256: file.sha256, size: file.bytes.length, proof: { method: 'none' } };
};

const slotOf = (name: string, game: string, yaml: string) => ({ name, game, yaml: { sha256: fileOf(yaml).sha256, size: fileOf(yaml).bytes.length } });

const unlisted = (patch: Partial<Hello> = {}): Hello =>
  helloOf({ client: QUEST, worlds: [worldOf('W', 'Relic of the Past', 'relic_of_the_past')], ...patch });

const quest = { worlds: [worldOf('U', 'Unlisted Quest', 'unlisted_quest')], slots: [slotOf('Zelda', 'Unlisted Quest', 'UY')] };

const failedRun = (template: SessionTemplate, lobby: LobbyRun): Session =>
  ({ id: `s_${lobby.lobbyId}`, snapshot: template, status: 'failed', createdAt: 0, lobbyId: lobby.lobbyId, error: 'stopped by the test' });

const setup = async ({ sandbox, trust = fakeTrust('active') }: GateOptions = {}) => {
  const dataDir = await mkdtemp(join(tmpdir(), 'archipelia-consent-'));
  const domains = createNodeDomains(dataDir);
  const store = createLobbyStore(domains.domain('lobbies'));
  const runs: LobbyRun[] = [];
  const overlays: OverlayInput[] = [];
  const run = (template: SessionTemplate, lobby: LobbyRun) => {
    runs.push(lobby);
    return Promise.resolve(failedRun(template, lobby));
  };
  const deps = testDeps({ store, output: domains.domain('sessions'), root: dataDir, trust, run, ...(sandbox ? { sandbox } : {}) });
  const make = () => createLobbyService({ ...deps, overlay: (input) => {
    overlays.push(input);
    return Promise.resolve({ ...input.runtime, root: input.dir });
  } });
  const stop = () => rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  return { service: make(), make, store, runs, overlays, dataDir, stop };
};

type Gate = Awaited<ReturnType<typeof setup>>;

const tokenOf = (sent: ServerMessage[]) => {
  const welcome = sent.find((message) => message.type === 'welcome');
  return welcome?.type === 'welcome' ? welcome.member.token : '';
};

const joinUnlisted = async (gate: Gate, hello = unlisted()) => {
  const lobby = await gate.service.create({ name: 'Consent', engine, options: { admission: 'open', allowUnlisted: true } });
  const { link, sent } = linkOf();
  const joined = await gate.service.protocol.join(hello, link);
  if (!joined.ok) throw new Error(joined.failure.message);
  await holdFiles(gate.store, lobby.id, ['W', 'Y', 'U', 'UY']);
  await gate.service.protocol.settle(lobby.id);
  return { lobby, ref: joined.value, token: tokenOf(sent) };
};

const stateOf = (lobby: Lobby | undefined) => lobby?.members[0]?.slots[0]?.state;

const modulesOf = (inputs: OverlayInput[]) => inputs.map((input) => input.worlds.map((world) => world.module));

const claimReady = (lobby: Lobby): Lobby => ({ ...lobby, members: lobby.members.map((member) => ({ ...member, slots: member.slots.map((slot) => ({ ...slot, state: 'ok' as const })) })) });

const wrappedGenerate = (gate: Gate) => {
  const [run] = gate.runs;
  if (!run?.confine) throw new Error('the run has no sandbox');
  const wrap = run.confine('/srv/sessions/s1');
  if (!wrap) throw new Error('the sandbox did not wrap the run');
  return { run, command: wrap({ file: 'python', args: ['Generate.py'], cwd: '/srv/sessions/s1', env: {} }) };
};

describe('consent gate with no sandbox (Windows, macOS, Linux without bubblewrap)', () => {
  test('no run and no overlay touch an unlisted world before the host allows it', async () => {
    const gate = await setup();
    const { lobby } = await joinUnlisted(gate);
    expect(stateOf(await gate.service.get(lobby.id))).toBe('waiting-consent');
    await expect(gate.service.start(lobby.id)).rejects.toThrow('no slot is ready to play');
    expect({ runs: gate.runs.length, overlays: gate.overlays.length }).toEqual({ runs: 0, overlays: 0 });
    await gate.service.consent(lobby.id, fileOf('W').sha256, true);
    await (await gate.service.start(lobby.id)).finished;
    expect(modulesOf(gate.overlays)).toEqual([['relic_of_the_past']]);
    const [run] = gate.runs;
    expect(run?.hostRuntime?.root).toBe(gate.dataDir);
    expect(run?.runtime.root).toBe(gate.overlays[0]?.dir);
    expect(run?.confine?.('/run')).toBeUndefined();
    await gate.stop();
  });

  test('a world the host refused never runs', async () => {
    const gate = await setup();
    const { lobby } = await joinUnlisted(gate);
    await gate.service.consent(lobby.id, fileOf('W').sha256, false);
    expect(stateOf(await gate.service.get(lobby.id))).toBe('refused');
    await expect(gate.service.start(lobby.id)).rejects.toThrow('no slot is ready to play');
    expect(gate.runs).toEqual([]);
    await gate.stop();
  });
});

describe('consent survives no bypass', () => {
  test('slots.set with another world after consent waits for consent again', async () => {
    const gate = await setup();
    const { lobby, ref } = await joinUnlisted(gate);
    await gate.service.consent(lobby.id, fileOf('W').sha256, true);
    await gate.service.protocol.slots(ref, { type: 'slots.set', seq: 2, ...quest });
    await gate.service.protocol.settle(lobby.id);
    expect(stateOf(await gate.service.get(lobby.id))).toBe('waiting-consent');
    await expect(gate.service.start(lobby.id)).rejects.toThrow('no slot is ready to play');
    expect(gate.runs).toEqual([]);
    await gate.stop();
  });

  test('a resume with another world waits for consent again', async () => {
    const gate = await setup();
    const { lobby, token } = await joinUnlisted(gate);
    await gate.service.consent(lobby.id, fileOf('W').sha256, true);
    const resumed = await gate.service.protocol.join(unlisted({ resume: token, ...quest }), linkOf().link);
    expect(resumed.ok).toBe(true);
    await gate.service.protocol.settle(lobby.id);
    const after = await gate.service.get(lobby.id);
    expect(after?.worlds.map((world) => ({ module: world.module, consent: world.consent }))).toEqual([{ module: 'unlisted_quest', consent: undefined }]);
    expect(stateOf(after)).toBe('waiting-consent');
    await gate.stop();
  });

  test('a restart after the host withdraws consent does not run the world', async () => {
    const gate = await setup();
    const { lobby } = await joinUnlisted(gate);
    await gate.service.consent(lobby.id, fileOf('W').sha256, true);
    expect((await (await gate.service.start(lobby.id)).finished).phase).toBe('failed');
    await gate.service.consent(lobby.id, fileOf('W').sha256, false);
    const again = await (await gate.service.start(lobby.id)).finished;
    expect(again.failure?.message).toContain('has not allowed');
    expect(gate.runs).toHaveLength(1);
    await gate.stop();
  });

  test('a reload keeps a refusal, even when the saved slot claims to be ready', async () => {
    const gate = await setup();
    const { lobby } = await joinUnlisted(gate);
    await gate.service.consent(lobby.id, fileOf('W').sha256, false);
    const saved = await gate.service.get(lobby.id);
    if (!saved) throw new Error('no lobby');
    await gate.store.save(claimReady(saved));
    const finished = await (await gate.make().start(lobby.id)).finished;
    expect(finished.failure?.message).toContain('has not allowed');
    expect({ runs: gate.runs.length, overlays: gate.overlays.length }).toEqual({ runs: 0, overlays: 0 });
    await gate.stop();
  });
});

describe('sandboxed lobby runs', () => {
  test('Generate of an unlisted world runs in bubblewrap with only the overlay and run folder writable, and the room runs from the plain engine', async () => {
    const gate = await setup({ sandbox: createBwrapRunner('/usr/bin/bwrap', BASIC_FEATURES) });
    const { lobby } = await joinUnlisted(gate);
    await gate.service.consent(lobby.id, fileOf('W').sha256, true);
    await (await gate.service.start(lobby.id)).finished;
    const { run, command } = wrappedGenerate(gate);
    const overlay = run.runtime.root;
    expect(command.file).toBe('/usr/bin/bwrap');
    expect(command.args.join(' ')).toContain(`--bind ${overlay} ${overlay} --bind /srv/sessions/s1 /srv/sessions/s1 --chdir /srv/sessions/s1 -- python Generate.py`);
    expect(command.args).toContain('--unshare-all');
    expect(run.hostRuntime?.root).toBe(gate.dataDir);
    await gate.stop();
  });

  test('a lobby of verified worlds keeps its overlay for the room and needs no sandbox', async () => {
    const gate = await setup({ sandbox: createBwrapRunner('/usr/bin/bwrap', BASIC_FEATURES) });
    const lobby = await gate.service.create({ name: 'Listed', engine, options: { admission: 'open' } });
    await gate.service.protocol.join(helloOf(), linkOf().link);
    await holdFiles(gate.store, lobby.id, ['W', 'Y']);
    await gate.service.protocol.settle(lobby.id);
    await (await gate.service.start(lobby.id)).finished;
    const [run] = gate.runs;
    expect({ host: run?.hostRuntime, confine: run?.confine }).toEqual({ host: undefined, confine: undefined });
    await gate.stop();
  });
});

describe('N3: trust checks run outside the lobby queue', () => {
  test('a slow registry does not hold the lobby while a join waits on it', async () => {
    let release = () => undefined as void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    const base = fakeTrust('active');
    const gate = await setup({ trust: { ...base, registry: async () => { await held; return base.registry(); } } });
    const lobby = await gate.service.create({ name: 'Slow', engine, options: { admission: 'open', allowUnlisted: true } });
    const joining = gate.service.protocol.join(unlisted(), linkOf().link);
    await tick();
    const settled = await Promise.race([gate.service.protocol.settle(lobby.id).then(() => 'settled'), tick(1000).then(() => 'stuck')]);
    expect(settled).toBe('settled');
    release();
    expect((await joining).ok).toBe(true);
    await gate.stop();
  });
});
