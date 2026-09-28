/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../support/launch-app';
import { settledProof } from '../support/settled-proof';
import { SOH, TIMESPINNER } from '../support/flow-constants';
import { cardOf, closeLayer, openScreen } from '../support/locators';

const INSTALL_TIMEOUT = 180000;

const tab = (games: Locator, name: string) => games.getByRole('tab', { name: new RegExp(`^${name}`) });

const search = (games: Locator, text: string) => games.getByRole('textbox', { name: 'Search worlds' }).fill(text);

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
  await tab(games, 'Official').click();
  await cardOf(games, 'A Link to the Past').waitFor();
  await settledProof(launched, '06-games-official');
  await search(games, TIMESPINNER.card);
  await addWorld(games, TIMESPINNER.card);
  await settledProof(launched, '07-games-timespinner-installed');
  await tab(games, 'Community').click();
  await search(games, 'Harkinian');
  await cardOf(games, SOH.card).waitFor();
  await settledProof(launched, '08-games-community-search');
  await addWorld(games, SOH.card);
  await settledProof(launched, '09-games-soh-installed');
  await search(games, '');
  await tab(games, 'Installed').click();
  for (const title of [SOH.card, TIMESPINNER.card]) await cardOf(games, title).getByText('Installed', { exact: true }).waitFor();
  expect(await tab(games, 'Installed').textContent()).toContain('2');
  await settledProof(launched, '10-games-installed-tab');
  await tab(games, 'Updates').click();
  await games.getByText('No world matches').waitFor();
  await settledProof(launched, '11-games-updates-tab');
  await closeLayer(launched.page, 'Games');
};

const removeBothWorlds = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await tab(games, 'Installed').click();
  for (const title of [TIMESPINNER.card, SOH.card]) {
    await cardOf(games, title).getByRole('button', { name: `Remove ${title}`, exact: true }).click();
    await cardOf(games, title).waitFor({ state: 'detached' });
  }
  await games.getByText('No world matches').waitFor();
  await games.getByText(/0 installed/).waitFor();
  await settledProof(launched, '40-games-all-removed');
  await closeLayer(launched.page, 'Games');
};

export { addBothWorlds, removeBothWorlds };
