/* @layer tests @kind helper */
import { expect } from 'vitest';
import { addWorld, openGames, openTab, search } from '../../app/steps/games';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { cardOf, closeHub, hub } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { BALDUR, RELIC, TIMEOUT } from '../support/session-constants';

const startBaldurInstall = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await openTab(games, 'Archipelago index');
  await search(games, BALDUR.search);
  await cardOf(games, BALDUR.title).getByRole('button', { name: 'Add', exact: true }).click();
};

const waitBaldurInstalled = async (launched: LaunchedApp) => {
  const games = hub(launched.page, 'Multiworld');
  await cardOf(games, BALDUR.title).getByText('Installed', { exact: true }).waitFor({ timeout: TIMEOUT.install });
  await settledProof(launched, '50-session-baldur-installed');
};

const addRelic = async (launched: LaunchedApp) => {
  const games = hub(launched.page, 'Multiworld');
  await search(games, '');
  await openTab(games, 'Archipelia ready');
  await search(games, RELIC.search);
  await cardOf(games, RELIC.title).waitFor();
  expect(await cardOf(games, RELIC.title).getByText('Verified', { exact: true }).count(), 'Relic of the Past carries the Verified tag').toBeGreaterThan(0);
  await addWorld(games, RELIC.title);
  await settledProof(launched, '51-session-relic-installed');
  await search(games, '');
  await openTab(games, 'Installed');
  await games.getByText(/ · 2 installed/).waitFor();
  await closeHub(launched.page, 'Multiworld');
};

export { addRelic, startBaldurInstall, waitBaldurInstalled };
