/* @layer tests @kind test */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { Client } from 'archipelago.js';
import { addBothWorlds, removeBothWorlds } from './steps/games';
import { checkEngineTab, createProfile, setLocalPort, visitSettingsTabs } from './steps/first-boot';
import { checkDataAndExport, checkHistory } from './steps/library-data';
import { playLiveRoom, stopFromDashboard } from './steps/live-room';
import { buildPresets } from './steps/presets';
import { manageServer } from './steps/servers';
import { buildAndRun } from './steps/session-run';
import { engineLeftovers } from './support/engine-cleanup';
import { PROOF_DIR } from './support/flow-constants';
import { launchApp } from './support/launch-app';
import type { LaunchedApp } from './support/launch-app';
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

  test('1. first boot: create a profile, the base screen is idle, Home shows the engine ready', () => createProfile(app()));

  test('2a. settings: every tab opens', () => visitSettingsTabs(app()));

  test('2b. settings: the engine tab shows Ready and AP 0.6.7', () => checkEngineTab(app()));

  test('2c. settings: the local port persists after reopening', () => setLocalPort(app()));

  test('3. games: add Timespinner and Ship of Harkinian', () => addBothWorlds(app()));

  test('4. presets: one per game, a toggle and a choice changed, saved and exported', () => buildPresets(app()));

  test('5. sessions: build, save as template, run and host', () => buildAndRun(app()));

  test('6. live room: two players join, check, and the console answers', () => playLiveRoom(app(), state.clients));

  test('7a. session: stop from the dashboard', () => stopFromDashboard(app(), state.clients));

  test('7b. sessions: history shows the stopped run and Open returns to it', () => checkHistory(app()));

  test('7c. data: sizes per area and a library export', () => checkDataAndExport(app()));

  test('8. servers: validation, save, remove', () => manageServer(app()));

  test('9. games: remove both worlds and the engine is clean', async () => {
    await removeBothWorlds(app());
    expect(await engineLeftovers()).toEqual([]);
  });
});
