/* @layer tests @kind helper */
import type { Locator, Page } from 'playwright-core';

type ScreenName = 'Home' | 'Session' | 'Settings' | 'Sessions' | 'Games' | 'Presets' | 'Servers' | 'Data';

const rail = (page: Page) => page.getByRole('navigation', { name: 'Screens' });

const layer = (page: Page, title: string) => page.getByRole('dialog', { name: title, exact: true });

const cardOf = (scope: Locator, title: string) => scope.getByRole('group', { name: title, exact: true });

const optionRowOf = (scope: Locator, label: string) => scope.getByRole('group', { name: label, exact: true });

const playerRowOf = (scope: Locator, slot: number) => scope.getByRole('group', { name: `Player ${slot}`, exact: true });

const openScreen = async (page: Page, name: ScreenName) => {
  await rail(page).getByRole('button', { name, exact: true }).click();
  return layer(page, name);
};

const closeLayer = (page: Page, title: string) => layer(page, title).getByRole('button', { name: 'Close' }).first().click();

const pickOption = async (page: Page, trigger: Locator, option: string) => {
  await trigger.click();
  const escaped = option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.getByRole('listbox').getByRole('option', { name: new RegExp(`^(\\W\\s*)?${escaped}$`) }).click();
};

const nestedButtons = (page: Page) => page.locator('button button').count();

const shownOpacity = (target: Locator) => target.evaluate((node) => {
  let opacity = 1;
  for (let at = node.parentElement; at; at = at.parentElement) opacity *= Number(getComputedStyle(at).opacity);
  return opacity;
});

const dialogOf = layer;

export { cardOf, closeLayer, dialogOf, layer, nestedButtons, openScreen, optionRowOf, pickOption, playerRowOf, rail, shownOpacity };