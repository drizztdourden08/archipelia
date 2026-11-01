/* @layer tests @kind test */
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { bootWithDefaultProfile, setLocalPort } from '../app/steps/first-boot';
import { stopFromDashboard } from '../app/steps/live-room';
import { engineLeftovers } from '../app/support/engine-cleanup';
import { launchApp } from '../app/support/launch-app';
import type { LaunchedApp } from '../app/support/launched-app.type';
import { tearDown } from '../app/support/safety-net';
import { buildLanSession } from './steps/build-session';
import { installSessionWorlds } from './steps/install-worlds';
import { approveJoin, checkJoinedOptions, startRotpA } from './steps/lobby-join';
import { checkConsole, checkResults, checkRoom, checkSpoiler, hostSession, sendHints, startRotpB, waitForChests } from './steps/play-session';
import type { SessionDirs } from './steps/session-dirs.type';
import { stopRotp } from './support/rotp-instance';
import type { RotpInstance } from './support/rotp-instance';
import { ROTP_A, ROTP_B, SESSION_PROOF_DIR } from './support/session-constants';
import { sessionEnv } from './support/session-env';

// This spec needs the built app, an engine, the network, a RotP build and a ROM, so it never runs by default.
// Needs: E2E_SESSION=1, ROTP_BIN (the RotP executable), ROTP_ROM (the ROM), and optionally ROTP_YAML_FLAG.
// Each RotP instance writes its events with --event-log; the chest is done on item-received with self true after connected.
describe.skipIf(process.env.E2E_SESSION !== '1')('Archipelia session with a live RotP join and a normal RotP player, headless', () => {
  const state: { launched?: LaunchedApp; dirs?: SessionDirs; env?: ReturnType<typeof sessionEnv>; rotp: RotpInstance[] } = { rotp: [] };
  const app = () => {
    if (!state.launched) throw new Error('the app did not launch');
    return state.launched;
  };
  const env = () => {
    if (!state.env) throw new Error('the session env is not read');
    return state.env;
  };
  const dirs = () => {
    if (!state.dirs) throw new Error('the RotP folders are not made');
    return state.dirs;
  };
  const tabOf = () => app().page.locator('.session-tabs__body');

  beforeAll(async () => {
    state.env = sessionEnv();
    const root = await mkdtemp(join(tmpdir(), 'archipelia-session-'));
    state.dirs = { profileA: join(root, 'rotp-a'), profileB: join(root, 'rotp-b'), logs: join(SESSION_PROOF_DIR, 'rotp') };
    expect(await engineLeftovers(), 'the shared engine must start clean').toEqual([]);
    state.launched = await launchApp(SESSION_PROOF_DIR);
  });

  afterAll(async () => {
    await Promise.all(state.rotp.map((instance) => stopRotp(instance)));
    const notes = await tearDown(state.launched, []);
    expect(await engineLeftovers()).toEqual([]);
    expect(notes, 'teardown notes').toEqual([]);
  });

  test('1. first boot on a fresh profile, with the local port set', async () => {
    await bootWithDefaultProfile(app());
    await setLocalPort(app());
  });

  test('2. games: Baldur\'s Gate from the Archipelago index and Relic of the Past, verified, from Archipelia ready', () => installSessionWorlds(app()));

  test('3. session: LAN with direct connections, slot 1 Baldur\'s Gate saved, slot 2 RotP-B from its own YAML', async () => {
    await buildLanSession(app());
  });

  test('4. lobby: RotP-A asks to join live and the host approves it', async () => {
    state.rotp.push(await startRotpA(app(), env(), dirs()));
    await approveJoin(app(), tabOf());
  });

  test('5. lobby: the host sees the options of RotP-A and cannot edit them', () => checkJoinedOptions(app(), tabOf()));

  test('6. run: the session compiles and hosts', async () => {
    await hostSession(app(), tabOf());
  });

  test('7. play: RotP-B connects by script and both runners open their chest in Link\'s house', async () => {
    state.rotp.push(await startRotpB(app(), env(), dirs()));
    await waitForChests(state.rotp);
  });

  test('8. results and hints: both chest items arrive in Players and Log, and a hint goes out for each', async () => {
    const results = await checkResults(app(), [ROTP_A.slot, ROTP_B.slot]);
    await sendHints(app(), results);
  });

  test('9. runner functions: spoiler, room, console and stop', async () => {
    await checkSpoiler(app(), [ROTP_A.slot, ROTP_B.slot]);
    await checkRoom(app());
    await checkConsole(app());
    await stopFromDashboard(app(), []);
  });
});
