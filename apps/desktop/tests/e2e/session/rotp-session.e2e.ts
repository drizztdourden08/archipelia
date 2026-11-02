/* @layer tests @kind test */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, describe, test } from 'vitest';
import { bootWithDefaultProfile, setLocalPort } from '../app/steps/first-boot';
import { removeWorlds } from '../app/steps/games';
import { stopFromDashboard } from '../app/steps/live-room';
import { proof } from '../app/support/proof';
import { buildLanSession } from './steps/build-session';
import { addRelic, startBaldurInstall, waitBaldurInstalled } from './steps/install-worlds';
import { approveJoin, checkJoinedOptions, startRotpA, waitForJoinRequest } from './steps/lobby-join';
import { checkConsole, checkResults, checkRoom, checkSpoiler, hostSession, sendHints, startRotpB, waitForChest } from './steps/play-session';
import { BALDUR, E2E_TEST_TIMEOUT_MS, RELIC, ROTP_A, ROTP_B } from './support/session-constants';
import { sessionState } from './support/session-state';

describe.skipIf(process.env.E2E_SESSION !== '1')('Archipelia session with a live RotP join and a normal RotP player, headless', { tags: ['e2e'], timeout: E2E_TEST_TIMEOUT_MS }, () => {
  const { state, app, env, dirs, rotpOf, tabOf, start, stop } = sessionState();

  beforeAll(start, E2E_TEST_TIMEOUT_MS);

  afterAll(stop, E2E_TEST_TIMEOUT_MS);

  afterEach(async ({ task }) => {
    if (task.result?.state !== 'fail') return;
    const name = `failed-step-${task.name.split('.')[0]}`;
    await proof(app(), name);
    await writeFile(join(app().proofDir, `${name}.aria.yml`), await app().page.locator('body').ariaSnapshot());
  });

  test('1. first boot on a fresh profile, with the local port set', async () => {
    await bootWithDefaultProfile(app());
    await setLocalPort(app());
  });

  test("2. games: start the Baldur's Gate 3 install from the Archipelago index", () => startBaldurInstall(app()));

  test("3. games: Baldur's Gate 3 finishes installing", () => waitBaldurInstalled(app()));

  test('4. games: Relic of the Past, verified, from Archipelia ready', () => addRelic(app()));

  test("5. session: LAN with direct connections, slot 1 Baldur's Gate 3 saved, slot 2 RotP-B from its own YAML", async () => {
    await buildLanSession(app(), env());
  });

  test('6. lobby: RotP-A starts, stays up and its join request reaches the host', async () => {
    const rotp = await startRotpA(app(), env(), dirs());
    state.rotp.push(rotp);
    await waitForJoinRequest(app(), tabOf(), rotp);
  });

  test('7. lobby: the host approves RotP-A', () => approveJoin(app(), tabOf(), rotpOf(ROTP_A.slot)));

  test('8. lobby: the host views the options of RotP-A and cannot edit them', () => checkJoinedOptions(app(), tabOf()));

  test('9. run: the session compiles and hosts', async () => {
    await hostSession(app(), tabOf());
  });

  test('10. play: RotP-B connects by script', async () => {
    state.rotp.push(await startRotpB(app(), env(), dirs()));
  });

  test("11. play: RotP-A opens its chest in Link's house", () => waitForChest(rotpOf(ROTP_A.slot)));

  test("12. play: RotP-B opens its chest in Link's house", () => waitForChest(rotpOf(ROTP_B.slot)));

  test('13. results and hints: both chest items arrive in Players and Log, and each RotP world gets a hint', async () => {
    await checkResults(app(), [ROTP_A.slot, ROTP_B.slot]);
    await sendHints(app(), [ROTP_A.slot, ROTP_B.slot]);
  });

  test('14. runner functions: spoiler, room, console and stop', async () => {
    await checkSpoiler(app(), [ROTP_A.slot, ROTP_B.slot]);
    await checkRoom(app());
    await checkConsole(app());
    await stopFromDashboard(app(), []);
  });

  test('15. games: remove both worlds', () => removeWorlds(app(), [BALDUR.title, RELIC.title]));
});
