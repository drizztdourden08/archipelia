/* @layer tests @kind helper */
import type { Locator, Page } from 'playwright-core';

type HubTitle = 'Multiworld' | 'Data';

type MenuEntry = 'Home' | 'Sessions' | 'Games' | 'Presets' | 'Servers' | 'Data' | 'Settings';

const HUB_OF: Record<MenuEntry, HubTitle> = {
  Home: 'Multiworld',
  Sessions: 'Multiworld',
  Games: 'Multiworld',
  Presets: 'Multiworld',
  Servers: 'Multiworld',
  Settings: 'Multiworld',
  Data: 'Data',
};

const PAGE_OF: Record<MenuEntry, string> = {
  Home: 'Home',
  Sessions: 'Sessions',
  Games: 'Games',
  Presets: 'Presets',
  Servers: 'Servers',
  Settings: 'General',
  Data: 'Overview',
};

const dialogOf = (page: Page, title: string) => page.getByRole('dialog', { name: title, exact: true });

const hub = (page: Page, title: HubTitle) => dialogOf(page, title);

const base = (page: Page) => page.locator('.session-dashboard, .idle-base');

const pageTitle = (scope: Locator, label: string) => scope.getByRole('heading', { name: label, exact: true, level: 3 }).first();

const cardOf = (scope: Locator, title: string) => scope.getByRole('group', { name: title, exact: true });

const optionRowOf = (scope: Locator, label: string) => scope.getByRole('group', { name: label, exact: true });

const playerRowOf = (scope: Locator, slot: number) => scope.getByRole('group', { name: `Player ${slot}`, exact: true });

const openScreen = async (page: Page, entry: MenuEntry) => {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('.dropdown-menu').getByRole('button', { name: entry, exact: true }).click();
  const opened = hub(page, HUB_OF[entry]);
  await pageTitle(opened, PAGE_OF[entry]).waitFor();
  return opened;
};

const openSection = async (scope: Locator, label: string) => {
  await scope.getByRole('navigation', { name: 'Sections' }).getByRole('button', { name: label, exact: true }).click();
  await pageTitle(scope, label).waitFor();
  return scope;
};

const closeHub = async (page: Page, title: HubTitle) => {
  const opened = hub(page, title);
  await opened.getByRole('button', { name: 'Close', exact: true }).first().click();
  await opened.waitFor({ state: 'detached' });
};

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

export { base, cardOf, closeHub, dialogOf, hub, nestedButtons, openScreen, openSection, optionRowOf, pickOption, playerRowOf, shownOpacity };
export type { HubTitle };
