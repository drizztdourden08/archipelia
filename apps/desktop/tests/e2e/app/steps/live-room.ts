/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Client } from 'archipelago.js';
import type { Locator, Page } from 'playwright-core';
import { widgetWindows } from '@drizztdourden08/brock-build/testing';
import { checkSome, joinAs } from '../../support/ap-player';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT, SOH, TIMESPINNER } from '../support/flow-constants';
import { expectReadableDock } from '../support/dock-geometry';
import { base, dialogOf, docked } from '../support/locators';
import { proofText } from '../support/proof-text';
import { popOutWidget } from '../support/widget-window';

const CHECKS = 10;

const DOCKED = ['players', 'hints', 'room', 'log', 'console'];

const playerItem = (widgets: Locator, game: string) =>
  widgets.getByRole('list', { name: 'Players', exact: true }).getByRole('listitem').filter({ hasText: game });

const filterLog = (widgets: Locator, text: string) => widgets.getByRole('searchbox', { name: 'Filter the log' }).fill(text);

const liveStatus = (scope: Locator, text: string | RegExp) => scope.getByRole('status').filter({ hasText: text });

const serverConsole = (page: Page) => page.locator('[data-widget-id="console"]');

const popOutButton = (page: Page, label: string) => page.getByRole('button', { name: `Pop out ${label}`, exact: true });

const popIn = async (popped: Page) => {
  const button = popped.getByRole('button', { name: 'Pop in Players', exact: true });
  await button.waitFor();
  await Promise.all([popped.waitForEvent('close'), button.evaluate((node: HTMLElement) => { setTimeout(() => node.click(), 0); })]);
};

const resetLayout = async (page: Page) => {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Widgets', exact: true }).click();
  await page.locator('[role^="menuitem"]', { hasText: /Reset layout/ }).click();
  await page.locator('[role^="menuitem"]', { hasText: /Click again to reset/ }).click();
};

const popPlayersOut = async (launched: LaunchedApp) => {
  const widgets = docked(launched.page);
  const popped = await popOutWidget(launched.app, 'players', () => popOutButton(launched.page, 'Players').click());
  const body = popped.locator('body');
  await playerItem(body, TIMESPINNER.game).getByText('connected', { exact: true }).waitFor();
  await playerItem(body, SOH.game).getByText(`${CHECKS} / `, { exact: false }).waitFor();
  await popIn(popped);
  await playerItem(widgets, SOH.game).getByText('connected', { exact: true }).waitFor();
  await resetLayout(launched.page);
  await popOutButton(launched.page, 'Players').waitFor();
  expect(await widgetWindows(launched.app), 'no widget window is left').toEqual([]);
};

const joinPlayers = async (launched: LaunchedApp, clients: Client[]) => {
  const dashboard = base(launched.page);
  const widgets = docked(launched.page);
  await playerItem(widgets, TIMESPINNER.game).getByText('offline').waitFor();
  await liveStatus(widgets, /^Live$/).first().waitFor();
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
  await filterLog(docked(launched.page), '');
  const consoleWidget = serverConsole(launched.page);
  const command = consoleWidget.getByRole('combobox', { name: 'Server command', exact: true });
  await command.fill('/players');
  await command.press('Enter');
  await consoleWidget.getByText('> /players', { exact: true }).waitFor();
  await consoleWidget.getByText(/2 players of 2 connected/).first().waitFor();
  await settledProof(launched, '25-live-console-players');
  await proofText(launched, '25-live-console-players', consoleWidget.getByText(/players of \d+ connected/));
  await command.press('ArrowUp');
  expect(await command.inputValue(), 'Up brings back the last command').toBe('/players');
  await consoleWidget.getByRole('button', { name: 'Send', exact: true }).click();
  await expect.poll(() => consoleWidget.getByText('> /players', { exact: true }).count()).toBe(2);
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
  await liveStatus(docked(launched.page), 'Not connected').first().waitFor();
  await expectReadableDock(launched.page, DOCKED);
  await settledProof(launched, '27-dashboard-stopped');
};

const playLiveRoom = async (launched: LaunchedApp, clients: Client[]) => {
  await joinPlayers(launched, clients);
  await askForPlayers(launched);
};

export { playLiveRoom, stopFromDashboard };
