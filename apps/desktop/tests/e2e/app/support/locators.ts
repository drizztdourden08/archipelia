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

const MENU_BUTTON = 'Menu';

const MENU_HOME = 'Home';

const IDLE_OPEN = 'Open Sessions';

const dialogOf = (page: Page, title: string) => page.getByRole('dialog', { name: title, exact: true });

const hub = (page: Page, title: HubTitle) => page.getByRole('dialog', { name: new RegExp(`^(Back )?${title}$`) });

const base = (page: Page) => page.locator('.session-dashboard, .idle-base');

const docked = (page: Page) => page.locator('[data-widget-id]');

const sectionsNav = (scope: Locator) => scope.getByRole('navigation', { name: 'Sections' });

const currentPage = (scope: Locator, label: string) =>
  sectionsNav(scope).getByRole('button', { name: label, exact: true }).and(scope.locator('[aria-current="page"]'));

const cardOf = (scope: Locator, title: string) =>
  scope.getByRole('gridcell').filter({ has: scope.page().getByRole('heading', { level: 3, name: title, exact: true }) });

const installedCountOf = (scope: Locator) =>
  scope.getByRole('region', { name: 'Games status' }).locator('dt', { hasText: /^Installed$/ }).locator('xpath=following-sibling::dd[1]');

const removeButtonOf = (scope: Locator, title: string) => cardOf(scope, title).getByRole('button', { name: `Remove ${title}`, exact: true });

const seatEditorOf = (scope: Locator, slot: number) => scope.getByRole('region', { name: `Edit player ${slot}`, exact: true });

const seatsOf = (scope: Locator) => scope.getByRole('group', { name: 'Seats', exact: true });

const openSection = async (scope: Locator, label: string) => {
  await sectionsNav(scope).getByRole('button', { name: label, exact: true }).click();
  await currentPage(scope, label).waitFor();
  return scope;
};

const hubIsOpen = (page: Page) => hub(page, 'Multiworld').first().isVisible();

const openHubFromMenu = async (page: Page) => {
  const menu = page.getByRole('button', { name: MENU_BUTTON, exact: true });
  if (await menu.count()) {
    await menu.click();
    await page.getByRole('menuitem', { name: MENU_HOME, exact: true }).click();
  } else {
    await base(page).getByRole('button', { name: IDLE_OPEN, exact: true }).click();
  }
  await hub(page, 'Multiworld').first().waitFor();
};

const openScreen = async (page: Page, entry: MenuEntry): Promise<Locator> => {
  if (!(await hubIsOpen(page))) await openHubFromMenu(page);
  return openSection(hub(page, HUB_OF[entry]), PAGE_OF[entry]);
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

export { base, cardOf, docked, closeHub, dialogOf, hub, installedCountOf, nestedButtons, openScreen, openSection, pickOption, removeButtonOf, seatEditorOf, seatsOf, shownOpacity };
export type { HubTitle };
