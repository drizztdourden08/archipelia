/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { SOH, TIMESPINNER } from '../support/flow-constants';
import { cardOf, closeHub, dialogOf, installedCountOf, openScreen, removeButtonOf } from '../support/locators';

const INSTALL_TIMEOUT = 180000;

const tab = (games: Locator, name: string) =>
  games.getByRole('navigation', { name: 'Games views', exact: true }).getByRole('button', { name, exact: true });

const openTab = async (games: Locator, name: string) => {
  await tab(games, name).click();
  await expect.poll(() => tab(games, name).getAttribute('aria-current')).toBe('location');
};

const search = (games: Locator, text: string) => games.getByRole('searchbox', { name: 'Search worlds' }).fill(text);

const addWorld = async (games: Locator, title: string) => {
  const card = cardOf(games, title);
  await card.getByRole('button', { name: `Add ${title}`, exact: true }).click();
  await removeButtonOf(games, title).waitFor({ timeout: INSTALL_TIMEOUT });
  return card;
};

const openGames = async (launched: LaunchedApp) => {
  const games = await openScreen(launched.page, 'Games');
  await games.getByText('Loading the catalog').waitFor({ state: 'hidden', timeout: 120000 });
  const status = games.getByRole('region', { name: 'Games status' });
  await status.getByText('Archipelago index for AP', { exact: true }).waitFor();
  await status.getByRole('definition').filter({ hasText: /^0\.6\.7$/ }).waitFor();
  return games;
};

const addBothWorlds = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await openTab(games, 'Built-in');
  await cardOf(games, 'A Link to the Past').waitFor();
  await settledProof(launched, '06-games-built-in');
  await search(games, TIMESPINNER.card);
  await addWorld(games, TIMESPINNER.card);
  await settledProof(launched, '07-games-timespinner-installed');
  await openTab(games, 'Archipelago index');
  await search(games, 'Harkinian');
  await cardOf(games, SOH.card).waitFor();
  await settledProof(launched, '08-games-index-search');
  await addWorld(games, SOH.card);
  await settledProof(launched, '09-games-soh-installed');
  await search(games, '');
  await openTab(games, 'Installed');
  for (const title of [SOH.card, TIMESPINNER.card]) await removeButtonOf(games, title).waitFor();
  await installedCountOf(games).filter({ hasText: /^2$/ }).waitFor();
  await settledProof(launched, '10-games-installed-tab');
  await openTab(games, 'Updates');
  await games.getByText('Every installed game is up to date').waitFor();
  await settledProof(launched, '11-games-updates-tab');
  await closeHub(launched.page, 'Multiworld');
};

const removeBothWorlds = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await openTab(games, 'Installed');
  for (const title of [TIMESPINNER.card, SOH.card]) {
    await cardOf(games, title).getByRole('button', { name: `Remove ${title}`, exact: true }).click();
    await dialogOf(launched.page, `Delete ${title}?`).getByRole('button', { name: 'Delete', exact: true }).click();
    await cardOf(games, title).waitFor({ state: 'detached' });
  }
  await games.getByText('No game installed yet').waitFor();
  await games.getByRole('button', { name: 'Open Built-in', exact: true }).waitFor();
  await installedCountOf(games).filter({ hasText: /^0$/ }).waitFor();
  await settledProof(launched, '40-games-all-removed');
  await closeHub(launched.page, 'Multiworld');
};

export { addBothWorlds, addWorld, openGames, openTab, removeBothWorlds, search };
