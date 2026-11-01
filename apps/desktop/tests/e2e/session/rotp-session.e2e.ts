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
import { addRelic, startBaldurInstall, waitBaldurInstalled } from './steps/install-worlds';
import { approveJoin, checkJoinedOptions, startRotpA } from './steps/lobby-join';
import { checkConsole, checkResults, checkRoom, checkSpoiler, hostSession, sendHints, startRotpB, waitForChest } from './steps/play-session';
import type { SessionDirs } from './steps/session-dirs.type';
import { stopRotp } from './support/rotp-instance';
import type { RotpInstance } from './support/rotp-instance';
import { E2E_TEST_TIMEOUT_MS, ROTP_A, ROTP_B, SESSION_PROOF_DIR } from './support/session-constants';
import { sessionEnv } from './support/session-env';

// This spec needs the built app, an engine, the network, a RotP build and a ROM, so it never runs by default.
// Needs: E2E_SESSION=1, ROTP_ROM (the ROM), and ROTP_BIN or one ROTP_BIN_A and ROTP_BIN_B per instance (each its own RotP checkout or binary).
// RotP-A joins through the lobby with a profile made from the form defaults; RotP-B's YAML is the generator input of slot 2 and RotP-B connects with --ap-connect.
// Every test fits the e2e cap of 120 s, so the long waits (install, join, chests) are split across ordered tests.
// Each RotP instance writes its events with --event-log; the chest is done on item-received with self true after connected.
describe.skipIf(process.env.E2E_SESSION !== '1')('Archipelia session with a live RotP join and a normal RotP player, headless', { tags: ['e2e'], timeout: E2E_TEST_TIMEOUT_MS }, () => {
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
  const rotpOf = (name: string) => {
    const found = state.rotp.find((instance) => instance.name === name);
    if (!found) throw new Error(`${name} was not started`);
    return found;
  };
  const tabOf = () => app().page.locator('.session-tabs__body');

  beforeAll(async () => {
    state.env = sessionEnv();
    const root = await mkdtemp(join(tmpdir(), 'archipelia-session-'));
    state.dirs = { profileA: join(root, 'rotp-a'), profileB: join(root, 'rotp-b'), logs: join(SESSION_PROOF_DIR, 'rotp') };
    expect(await engineLeftovers(), 'the shared engine must start clean').toEqual([]);
    state.launched = await launchApp(SESSION_PROOF_DIR);
  }, E2E_TEST_TIMEOUT_MS);

  afterAll(async () => {
    await Promise.all(state.rotp.map((instance) => stopRotp(instance)));
    const notes = await tearDown(state.launched, []);
    expect(await engineLeftovers()).toEqual([]);
    expect(notes, 'teardown notes').toEqual([]);
  }, E2E_TEST_TIMEOUT_MS);

  test('1. first boot on a fresh profile, with the local port set', async () => {
    await bootWithDefaultProfile(app());
    await setLocalPort(app());
  });

  test('2. games: start the Baldur's Gate 3 install from the Archipelago index', () => startBaldurInstall(app()));

  test('3. games: Baldur's Gate 3 finishes installing', () => waitBaldurInstalled(app()));

  test('4. games: Relic of the Past, verified, from Archipelia ready', () => addRelic(app()));

  test('5. session: LAN with direct connections, slot 1 Baldur's Gate 3 saved, slot 2 RotP-B from its own YAML', async () => {
    await buildLanSession(app());
  });

  test('6. lobby: RotP-A starts and asks to join live', async () => {
    state.rotp.push(await startRotpA(app(), env(), dirs()));
  });

  test('7. lobby: the host approves RotP-A', () => approveJoin(app(), tabOf()));

  test('8. lobby: the host views the options of RotP-A and cannot edit them', () => checkJoinedOptions(app(), tabOf()));

  test('9. run: the session compiles and hosts', async () => {
    await hostSession(app(), tabOf());
  });

  test('10. play: RotP-B connects by script', async () => {
    state.rotp.push(await startRotpB(app(), env(), dirs()));
  });

  test('11. play: RotP-A opens its chest in Link's house', () => waitForChest(rotpOf(ROTP_A.slot)));

  test('12. play: RotP-B opens its chest in Link's house', () => waitForChest(rotpOf(ROTP_B.slot)));

  test('13. results and hints: both chest items arrive in Players and Log, and a hint goes out for each', async () => {
    const results = await checkResults(app(), [ROTP_A.slot, ROTP_B.slot]);
    await sendHints(app(), results);
  });

  test('14. runner functions: spoiler, room, console and stop', async () => {
    await checkSpoiler(app(), [ROTP_A.slot, ROTP_B.slot]);
    await checkRoom(app());
    await checkConsole(app());
    await stopFromDashboard(app(), []);
  });
});
