/* @layer tests @kind test */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { Client } from 'archipelago.js';
import { addBothWorlds, removeBothWorlds } from './steps/games';
import { createProfile, setLocalPort } from './steps/first-boot';
import { checkHistory, exportData } from './steps/library-data';
import { playLiveRoom, stopFromDashboard } from './steps/live-room';
import { buildPresets } from './steps/presets';
import { buildAndRun } from './steps/session-run';
import { engineLeftovers } from './support/engine-cleanup';
import { PROOF_DIR } from './support/flow-constants';
import { launchApp } from './support/launch-app';
import type { LaunchedApp } from './support/launched-app.type';
import { tearDown } from './support/safety-net';

describe('Archipelia app, headless, every screen end to end', () => {
  const state: { launched?: LaunchedApp; clients: Client[] } = { clients: [] };
  const app = () => {
    if (!state.launched) throw new Error('the app did not launch');
    return state.launched;
  };

  beforeAll(async () => {
    expect(await engineLeftovers(), 'the shared engine must start clean').toEqual([]);
    state.launched = await launchApp(PROOF_DIR);
  });

  afterAll(async () => {
    const notes = await tearDown(state.launched, state.clients);
    expect(await engineLeftovers()).toEqual([]);
    expect(notes, 'teardown notes').toEqual([]);
  });

  test('1. first boot: create a profile, Home opens with the engine ready and the setup checklist, the base screen is idle behind it', () => createProfile(app()));

  test('2. settings: the local port persists after reopening', () => setLocalPort(app()));

  test('3. games: add Timespinner and Ship of Harkinian', () => addBothWorlds(app()));

  test('4. presets: one per game, a toggle and a choice changed, saved and exported', () => buildPresets(app()));

  test('5. sessions: build, save, run and host', () => buildAndRun(app()));

  test('6. live room: two players join, check, and the console answers', () => playLiveRoom(app(), state.clients));

  test('7a. session: stop from the dashboard', () => stopFromDashboard(app(), state.clients));

  test('7b. sessions: Runs shows the stopped run and Open returns to it', () => checkHistory(app()));

  test('7c. data: a zip export of the data folders', () => exportData(app()));

  test('8. games: remove both worlds and the engine is clean', async () => {
    await removeBothWorlds(app());
    expect(await engineLeftovers()).toEqual([]);
  });
});
