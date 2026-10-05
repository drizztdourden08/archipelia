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
  Data: 'Storage',
};

const dialogOf = (page: Page, title: string) => page.getByRole('dialog', { name: title, exact: true });

const hub = (page: Page, title: HubTitle) => page.getByRole('dialog', { name: new RegExp(`^(Back )?${title}$`) });

const base = (page: Page) => page.locator('.session-dashboard, .idle-base');

const docked = (page: Page) => page.locator('[data-widget-id]');

const sectionsNav = (scope: Locator) => scope.getByRole('navigation', { name: 'Sections' });

const currentPage = (scope: Locator, label: string) =>
  sectionsNav(scope).getByRole('button', { name: label, exact: true }).and(scope.locator('[aria-current="page"]'));

const cardOf = (scope: Locator, title: string) => scope.getByRole('group', { name: title, exact: true });

const playerRowOf = (scope: Locator, slot: number) => scope.getByRole('group', { name: `Player ${slot}`, exact: true });

const openScreen = async (page: Page, entry: MenuEntry) => {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('menuitem', { name: entry, exact: true }).click();
  const opened = hub(page, HUB_OF[entry]);
  await currentPage(opened, PAGE_OF[entry]).waitFor();
  return opened;
};

const openSection = async (scope: Locator, label: string) => {
  await sectionsNav(scope).getByRole('button', { name: label, exact: true }).click();
  await currentPage(scope, label).waitFor();
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

export { base, cardOf, docked, closeHub, dialogOf, hub, nestedButtons, openScreen, openSection, pickOption, playerRowOf, shownOpacity };
export type { HubTitle };
