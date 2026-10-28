/* @layer tests @kind helper */
import type { Locator, Page } from 'playwright-core';

type HubTitle = 'Multiworld';

type MenuEntry = 'Home' | 'Sessions' | 'History' | 'Games' | 'Presets' | 'Servers' | 'Storage' | 'Settings';

const HUB_OF: Record<MenuEntry, HubTitle> = {
  Home: 'Multiworld',
  Sessions: 'Multiworld',
  History: 'Multiworld',
  Games: 'Multiworld',
  Presets: 'Multiworld',
  Servers: 'Multiworld',
  Settings: 'Multiworld',
  Storage: 'Multiworld',
};

const LIBRARY_ENTRIES: readonly MenuEntry[] = ['Games', 'Presets'];

const PAGE_OF: Record<MenuEntry, string> = {
  Home: 'Home',
  Sessions: 'Sessions',
  History: 'History',
  Games: 'Games',
  Presets: 'Presets',
  Servers: 'Servers',
  Settings: 'General',
  Storage: 'Storage',
};

const OPENED_BY: Partial<Record<MenuEntry, MenuEntry>> = { Sessions: 'Home', History: 'Home', Storage: 'Settings' };

const dialogOf = (page: Page, title: string) => page.getByRole('dialog', { name: title, exact: true });

const hub = (page: Page, title: HubTitle) => page.getByRole('dialog', { name: new RegExp(`^(Back )?${title}$`) });

const base = (page: Page) => page.locator('.session-dashboard, .idle-base');

const docked = (page: Page) => page.locator('[data-widget-id]');

const sectionsNav = (scope: Locator) => scope.getByRole('navigation', { name: 'Sections' });

const currentPage = (scope: Locator, label: string) =>
  sectionsNav(scope).getByRole('button', { name: label, exact: true }).and(scope.locator('[aria-current="page"]'));

const cardOf = (scope: Locator, title: string) =>
  scope.locator('.item-card').filter({ has: scope.getByRole('heading', { level: 3, name: title, exact: true }) });

const seatEditorOf = (scope: Locator, slot: number) => scope.getByRole('region', { name: `Edit player ${slot}`, exact: true });

const seatsOf = (scope: Locator) => scope.getByRole('group', { name: 'Seats', exact: true });

const openSection = async (scope: Locator, label: string) => {
  await sectionsNav(scope).getByRole('button', { name: label, exact: true }).click();
  await currentPage(scope, label).waitFor();
  return scope;
};

const openScreen = async (page: Page, entry: MenuEntry): Promise<Locator> => {
  const via = OPENED_BY[entry];
  if (via !== undefined) return openSection(await openScreen(page, via), PAGE_OF[entry]);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  if (LIBRARY_ENTRIES.includes(entry)) await page.getByRole('menuitem', { name: 'Library', exact: true }).click();
  await page.getByRole('menuitem', { name: entry, exact: true }).click();
  const opened = hub(page, HUB_OF[entry]);
  await currentPage(opened, PAGE_OF[entry]).waitFor();
  return opened;
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

export { base, cardOf, docked, closeHub, dialogOf, hub, nestedButtons, openScreen, openSection, pickOption, seatEditorOf, seatsOf, shownOpacity };
export type { HubTitle };
