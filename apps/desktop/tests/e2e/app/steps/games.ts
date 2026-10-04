/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { SOH, TIMESPINNER } from '../support/flow-constants';
import { cardOf, closeHub, dialogOf, openScreen } from '../support/locators';

const INSTALL_TIMEOUT = 180000;

const tab = (games: Locator, name: string) =>
  games.getByRole('navigation', { name: 'Games tabs', exact: true }).getByRole('button', { name, exact: true });

const openTab = async (games: Locator, name: string) => {
  await tab(games, name).click();
  await expect.poll(() => tab(games, name).getAttribute('aria-current')).toBe('location');
};

const search = (games: Locator, text: string) => games.getByRole('searchbox', { name: 'Search worlds' }).fill(text);

const addWorld = async (games: Locator, title: string) => {
  const card = cardOf(games, title);
  await card.getByRole('button', { name: `Add ${title}`, exact: true }).click();
  await card.getByText('Installed', { exact: true }).waitFor({ timeout: INSTALL_TIMEOUT });
  return card;
};

const openGames = async (launched: LaunchedApp) => {
  const games = await openScreen(launched.page, 'Games');
  await games.getByText('Loading the catalog').waitFor({ state: 'hidden', timeout: 120000 });
  await games.getByText(/index for AP 0\.6\.7/).waitFor();
  return games;
};

const addBothWorlds = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await openTab(games, 'Official');
  await cardOf(games, 'A Link to the Past').waitFor();
  await settledProof(launched, '06-games-official');
  await search(games, TIMESPINNER.card);
  await addWorld(games, TIMESPINNER.card);
  await settledProof(launched, '07-games-timespinner-installed');
  await openTab(games, 'Community');
  await search(games, 'Harkinian');
  await cardOf(games, SOH.card).waitFor();
  await settledProof(launched, '08-games-community-search');
  await addWorld(games, SOH.card);
  await settledProof(launched, '09-games-soh-installed');
  await search(games, '');
  await openTab(games, 'Installed');
  for (const title of [SOH.card, TIMESPINNER.card]) await cardOf(games, title).getByText('Installed', { exact: true }).waitFor();
  await games.getByText(/ · 2 installed/).waitFor();
  await settledProof(launched, '10-games-installed-tab');
  await openTab(games, 'Updates');
  await games.getByText('No world matches').waitFor();
  await settledProof(launched, '11-games-updates-tab');
  await closeHub(launched.page, 'Multiworld');
};

const removeBothWorlds = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await openTab(games, 'Installed');
  for (const title of [TIMESPINNER.card, SOH.card]) {
    await cardOf(games, title).getByRole('button', { name: `Remove ${title}`, exact: true }).click();
    await dialogOf(launched.page, 'Remove game').getByRole('button', { name: 'Remove', exact: true }).click();
    await cardOf(games, title).waitFor({ state: 'detached' });
  }
  await games.getByText('No world matches').waitFor();
  await games.getByText(/0 installed/).waitFor();
  await settledProof(launched, '40-games-all-removed');
  await closeHub(launched.page, 'Multiworld');
};

export { addBothWorlds, removeBothWorlds };
