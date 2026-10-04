/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Client } from 'archipelago.js';
import type { Locator } from 'playwright-core';
import { checkSome, joinAs } from '../../support/ap-player';
import type { LaunchedApp } from '../support/launch-app';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT, SOH, TIMESPINNER } from '../support/flow-constants';
import { expectReadableDock } from '../support/dock-geometry';
import { base, dialogOf } from '../support/locators';
import { proofText } from '../support/proof-text';

const CHECKS = 10;

const DOCKED = ['Players', 'Hints', 'Room', 'Log', 'Console'];

const playerItem = (dashboard: Locator, game: string) =>
  dashboard.getByRole('list', { name: 'Players', exact: true }).getByRole('listitem').filter({ hasText: game });

const showDockBottom = (dashboard: Locator) =>
  dashboard.getByRole('region', { name: 'Session widgets', exact: true }).evaluate((dock) => dock.scrollIntoView({ block: 'end' }));

const filterLog =(dashboard: Locator, text: string) => dashboard.getByRole('searchbox', { name: 'Filter the log' }).fill(text);

const joinPlayers = async (launched: LaunchedApp, clients: Client[]) => {
  const dashboard = base(launched.page);
  await playerItem(dashboard, TIMESPINNER.game).getByText('offline').waitFor();
  const url = `ws://127.0.0.1:${LOCAL_PORT}`;
  const link = await joinAs({ url, slot: SOH.slot, game: SOH.game });
  clients.push(link);
  const lunais = await joinAs({ url, slot: TIMESPINNER.slot, game: TIMESPINNER.game });
  clients.push(lunais);
  expect(await checkSome(lunais, CHECKS)).toHaveLength(CHECKS);
  expect(await checkSome(link, CHECKS)).toHaveLength(CHECKS);
  await playerItem(dashboard, TIMESPINNER.game).getByText('connected', { exact: true }).waitFor();
  await playerItem(dashboard, SOH.game).getByText('connected', { exact: true }).waitFor();
  await playerItem(dashboard, SOH.game).getByText(`${CHECKS} / `, { exact: false }).waitFor();
  await dashboard.getByText('2 / 2', { exact: true }).waitFor();
  await expectReadableDock(launched.page, DOCKED);
  await settledProof(launched, '23-live-players-connected');
  await proofText(launched, '23-live-players-connected', dashboard.getByRole('listitem').filter({ hasText: /connected|offline/ }));
  await filterLog(dashboard, ' sent ');
  await dashboard.getByText(new RegExp(`${SOH.slot} sent .+ to ${TIMESPINNER.slot}`)).first().waitFor();
  await showDockBottom(dashboard);
  await settledProof(launched, '24-live-log-item-lines');
  await proofText(launched, '24-live-log-item-lines', dashboard.getByText(/ sent .+ to /));
  return dashboard;
};

const askForPlayers = async (launched: LaunchedApp, dashboard: Locator) => {
  await filterLog(dashboard, '');
  await dashboard.getByRole('textbox', { name: 'Server command', exact: true }).fill('/players');
  await dashboard.getByRole('button', { name: 'Send', exact: true }).click();
  await filterLog(dashboard, 'players of');
  await dashboard.getByText(/2 players of 2 connected/).first().waitFor();
  await showDockBottom(dashboard);
  await settledProof(launched, '25-live-console-players');
  await proofText(launched, '25-live-console-players', dashboard.getByText(/players of \d+ connected/));
  await filterLog(dashboard, '');
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
  await dashboard.getByText('Live data shows while the room is hosting.').first().waitFor();
  await expectReadableDock(launched.page, DOCKED);
  await settledProof(launched, '27-dashboard-stopped');
};

const playLiveRoom = async (launched: LaunchedApp, clients: Client[]) => askForPlayers(launched, await joinPlayers(launched, clients));

export { playLiveRoom, stopFromDashboard };
