/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Client } from 'archipelago.js';
import type { Locator, Page } from 'playwright-core';
import { checkSome, joinAs } from '../../support/ap-player';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT, SOH, TIMESPINNER } from '../support/flow-constants';
import { expectReadableDock } from '../support/dock-geometry';
import { base, dialogOf, docked } from '../support/locators';
import { proofText } from '../support/proof-text';
import { widgetWindow } from '../support/widget-window';

const CHECKS = 10;

const DOCKED = ['Players', 'Hints', 'Room', 'Log', 'Console'];

const playerItem = (widgets: Locator, game: string) =>
  widgets.getByRole('list', { name: 'Players', exact: true }).getByRole('listitem').filter({ hasText: game });

const filterLog = (widgets: Locator, text: string) => widgets.getByRole('searchbox', { name: 'Filter the log' }).fill(text);

const widgetFrame = (page: Page, title: string) =>
  docked(page).locator('.widget').filter({ has: page.locator('.widget__title', { hasText: new RegExp(`^${title}$`) }) });

const popPlayersOut = async (launched: LaunchedApp) => {
  const widgets = docked(launched.page);
  await widgetFrame(launched.page, 'Players').getByRole('button', { name: 'Pop out', exact: true }).click();
  const popped = await widgetWindow(launched.app, 'players');
  const body = popped.locator('body');
  await playerItem(body, TIMESPINNER.game).getByText('connected', { exact: true }).waitFor();
  await playerItem(body, SOH.game).getByText(`${CHECKS} / `, { exact: false }).waitFor();
  await popped.getByRole('button', { name: 'Pop in', exact: true }).click();
  await playerItem(widgets, SOH.game).getByText('connected', { exact: true }).waitFor();
  await base(launched.page).getByRole('button', { name: 'Reset layout', exact: true }).click();
  await widgetFrame(launched.page, 'Players').waitFor();
  expect(launched.app.windows().map((win) => win.url()).filter((url) => url.includes('widget=')), 'no widget window is left').toEqual([]);
};

const joinPlayers = async (launched: LaunchedApp, clients: Client[]) => {
  const dashboard = base(launched.page);
  const widgets = docked(launched.page);
  await playerItem(widgets, TIMESPINNER.game).getByText('offline').waitFor();
  const url = `ws://127.0.0.1:${LOCAL_PORT}`;
  const link = await joinAs({ url, slot: SOH.slot, game: SOH.game });
  clients.push(link);
  const lunais = await joinAs({ url, slot: TIMESPINNER.slot, game: TIMESPINNER.game });
  clients.push(lunais);
  expect(await checkSome(lunais, CHECKS)).toHaveLength(CHECKS);
  expect(await checkSome(link, CHECKS)).toHaveLength(CHECKS);
  await playerItem(widgets, TIMESPINNER.game).getByText('connected', { exact: true }).waitFor();
  await playerItem(widgets, SOH.game).getByText('connected', { exact: true }).waitFor();
  await playerItem(widgets, SOH.game).getByText(`${CHECKS} / `, { exact: false }).waitFor();
  await dashboard.getByText('2 / 2', { exact: true }).waitFor();
  await popPlayersOut(launched);
  await expectReadableDock(launched.page, DOCKED);
  await settledProof(launched, '23-live-players-connected');
  await proofText(launched, '23-live-players-connected', widgets.getByRole('listitem').filter({ hasText: /connected|offline/ }));
  await filterLog(widgets, ' sent ');
  await widgets.getByText(new RegExp(`${SOH.slot} sent .+ to ${TIMESPINNER.slot}`)).first().waitFor();
  await settledProof(launched, '24-live-log-item-lines');
  await proofText(launched, '24-live-log-item-lines', widgets.getByText(/ sent .+ to /));
};

const askForPlayers = async (launched: LaunchedApp) => {
  const widgets = docked(launched.page);
  await filterLog(widgets, '');
  await widgets.getByRole('textbox', { name: 'Server command', exact: true }).fill('/players');
  await widgets.getByRole('button', { name: 'Send', exact: true }).click();
  await filterLog(widgets, 'players of');
  await widgets.getByText(/2 players of 2 connected/).first().waitFor();
  await settledProof(launched, '25-live-console-players');
  await proofText(launched, '25-live-console-players', widgets.getByText(/players of \d+ connected/));
  await filterLog(widgets, '');
};

const stopFromDashboard = async (launched: LaunchedApp, clients: Client[]) => {
  clients.forEach((client) => client.socket.disconnect());
  const dashboard = base(launched.page);
  await dashboard.getByRole('button', { name: 'Stop', exact: true }).click();
  const confirm = dialogOf(launched.page, 'Stop the room');
  await confirm.getByText('The server stops and every player is disconnected.').waitFor();
  await settledProof(launched, '26-dashboard-stop-confirm');
  await confirm.getByRole('button', { name: 'Stop', exact: true }).click();
  await dashboard.getByText(/^stopped$/i).first().waitFor({ timeout: 30000 });
  await docked(launched.page).getByText('Live data shows while the room is hosting.').first().waitFor();
  await expectReadableDock(launched.page, DOCKED);
  await settledProof(launched, '27-dashboard-stopped');
};

const playLiveRoom = async (launched: LaunchedApp, clients: Client[]) => {
  await joinPlayers(launched, clients);
  await askForPlayers(launched);
};

export { playLiveRoom, stopFromDashboard };
