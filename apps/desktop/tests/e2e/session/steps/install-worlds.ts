/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import { addWorld, openGames, openTab, search } from '../../app/steps/games';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { cardOf, closeHub } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { BALDUR, RELIC, TIMEOUT } from '../support/session-constants';

const cardTitled = (games: Locator, title: string | RegExp) =>
  games.locator('.item-card').filter({ has: games.getByRole('heading', { level: 3, name: title }) });

const addIndexWorld = async (games: Locator) => {
  await openTab(games, 'Archipelago index');
  await search(games, BALDUR.search);
  const card = cardTitled(games, BALDUR.title);
  await card.getByRole('button', { name: /^Add / }).click();
  await card.getByText('Installed', { exact: true }).waitFor({ timeout: TIMEOUT.install });
};

const addVerifiedWorld = async (games: Locator) => {
  await openTab(games, 'Archipelia ready');
  await search(games, RELIC.search);
  await cardOf(games, RELIC.title).waitFor();
  expect(await cardOf(games, RELIC.title).getByText('Verified', { exact: true }).count(), 'Relic of the Past carries the Verified tag').toBeGreaterThan(0);
  await addWorld(games, RELIC.title);
};

const installSessionWorlds = async (launched: LaunchedApp) => {
  const games = await openGames(launched);
  await addIndexWorld(games);
  await settledProof(launched, '50-session-baldur-installed');
  await addVerifiedWorld(games);
  await settledProof(launched, '51-session-relic-installed');
  await search(games, '');
  await openTab(games, 'Installed');
  await games.getByText(/ · 2 installed/).waitFor();
  await closeHub(launched.page, 'Multiworld');
};

export { installSessionWorlds };
