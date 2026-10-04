/* @layer tests @kind helper */
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { listInstalled, removeWorld } from '@archipelia/catalog';
import { readRuntime } from '@archipelia/engine';
import { createLocalHost } from '@archipelia/hosts';
import type { DataFiles, Session, SessionPlayer } from '@archipelia/model';
import { createPresetStore } from '@archipelia/presets';
import type { PresetStore } from '@archipelia/presets';
import { createRunStore, createSessionService } from '@archipelia/sessions';
import type { SessionService } from '@archipelia/sessions';
import type { Client } from 'archipelago.js';
import { checkAll, checkSome, joinAs, reachGoal, waitFor, waitForItems } from './ap-player';
import { ENGINE_DIR } from './e2e-inputs';
import { required } from './required';
import { dataFilesAt, tempDataRoot } from './temp-file-store';

type RigContext = { games: DataFiles; cache: DataFiles; presets: PresetStore };
type Multiworld = { title: string; port: number; setup: (ctx: RigContext) => Promise<SessionPlayer[]> };
type RigState = { root: string; session?: Session; service?: SessionService; players: SessionPlayer[]; clients: Client[]; log: string[] };

const serverOptions = { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 } as const;

const startRig = async (state: RigState, { title, port, setup }: Multiworld) => {
  state.root = await tempDataRoot();
  const files = dataFilesAt(join(state.root, 'sessions'));
  const games = dataFilesAt(join(state.root, 'games'));
  const runtime = await readRuntime(ENGINE_DIR);
  const presets = createPresetStore(dataFilesAt(join(state.root, 'presets')));
  state.players = await setup({ games, cache: dataFilesAt(join(state.root, 'cache')), presets });
  const installed = await listInstalled(games);
  state.service = createSessionService({
    files, presets, runs: createRunStore(files), runtime: () => Promise.resolve(runtime),
    schemaOf: (game) => Promise.resolve(installed.find((record) => record.game === game)?.schema),
    hostFor: () => Promise.resolve(createLocalHost({ runtime, port, bindHost: '127.0.0.1', advertiseHost: '127.0.0.1' })),
    resolveSecret: () => Promise.resolve(null),
    emit: (event) => { if (event.type === 'log') state.log.push(event.line.text); },
  });
  state.session = await state.service.run({
    id: 'rig', name: title, updatedAt: 0, host: { kind: 'local', port }, players: state.players,
    generator: { spoiler: 2, race: false, progressionBalancing: true }, server: serverOptions,
  });
};

const stopRig = async (state: RigState) => {
  state.clients.forEach((client) => client.socket.disconnect());
  if (state.service && state.session?.status === 'hosting') await state.service.stop(state.session.id);
  const files = dataFilesAt(join(state.root, 'games'));
  for (const game of await listInstalled(files)) await removeWorld({ engineDir: ENGINE_DIR, files, apworld: game.apworld });
};

const joinEveryone = async (state: RigState, port: number) => {
  for (const player of state.players) state.clients.push(await joinAs({ url: `ws://127.0.0.1:${port}`, slot: player.name, game: player.game }));
  const service = required(state.service, 'the session service');
  await service.command(required(state.session, 'the session').id, '/players');
  const pattern = new RegExp(`${state.players.length} players of ${state.players.length} connected`);
  await waitFor(() => state.log.some((line) => pattern.test(line)), 10000, 'the /players answer');
};

const sendAcrossWorlds = async (state: RigState) => {
  const [first, second] = state.clients;
  const receiver = required(first, 'the first client');
  const before = receiver.items.received.length;
  await checkAll(required(second, 'the second client'));
  await waitForItems(receiver, before + 1);
  await checkSome(receiver, 25);
  expect(receiver.items.received.length).toBeGreaterThan(before);
};

const goalCount = (log: string[]) => log.filter((line) => /has completed their goal/.test(line)).length;

const reachEveryGoal = async (state: RigState) => {
  state.clients.forEach(reachGoal);
  const count = state.players.length;
  await waitFor(() => goalCount(state.log) >= count, 15000, `${count} goals`);
};

const defineMultiworld = (multiworld: Multiworld) => describe(multiworld.title, () => {
  const state: RigState = { root: '', players: [], clients: [], log: [] };

  beforeAll(() => startRig(state, multiworld));
  afterAll(() => stopRig(state));

  test('the session generates and hosts', () => {
    expect(state.session?.error).toBeUndefined();
    expect(state.session?.status).toBe('hosting');
    expect(state.session?.output?.spoiler).toMatch(/_Spoiler\.txt$/);
  });

  test('every player joins and the server sees them', () => joinEveryone(state, multiworld.port));
  test('checks in one world send items to another', () => sendAcrossWorlds(state));
  test('every player reaches the goal and the server records it', () => reachEveryGoal(state));
});

export { defineMultiworld };
export type { RigContext };
