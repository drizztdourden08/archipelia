/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT, PROFILE } from '../support/flow-constants';
import { base, closeHub, dialogOf, hub, nestedButtons, openScreen, openSection } from '../support/locators';

const SETTINGS_TABS: [string, string][] = [
  ['General', 'Open in fullscreen on launch.'],
  ['Engine', 'Archipelago'],
  ['Hosting', 'Players connect to this computer on this port.'],
  ['archipelago.gg', 'The Archipelago website that hosts the rooms of sessions run there.'],
];

const SETUP_STEPS: [string, string][] = [['Engine', 'Done'], ['Games', 'To do'], ['Preset', 'To do'], ['Session', 'To do']];

const createProfile = async (launched: LaunchedApp) => {
  const { page } = launched;
  const profiles = dialogOf(page, 'Profiles');
  await profiles.getByText('Create a profile to get started').waitFor();
  await settledProof(launched, '01-profiles-first-boot');
  await profiles.getByRole('textbox', { name: 'Profile name' }).fill(PROFILE);
  await profiles.getByRole('button', { name: 'Create' }).click();
  const home = hub(page, 'Multiworld');
  await home.getByRole('heading', { name: 'Add your first game', level: 2, exact: true }).waitFor();
  expect(await home.locator('.hero__actions .btn--primary').count(), 'one primary action on Home').toBe(1);
  await expect.poll(() => home.getByText(/Engine AP 0\.6\.7 ready/).count()).toBe(1);
  const steps = home.getByRole('list', { name: 'Setup steps', exact: true }).getByRole('listitem');
  await expect.poll(() => steps.count(), { message: 'the first run checklist has four steps' }).toBe(4);
  for (const [index, [step, state]] of SETUP_STEPS.entries()) {
    const row = steps.nth(index);
    await row.getByText(`${index + 1}. ${step}`, { exact: true }).waitFor();
    await row.getByText(state, { exact: true }).waitFor();
  }
  expect(await nestedButtons(page), 'no button inside a button on Home').toBe(0);
  await settledProof(launched, '02-home-engine-ready');
  await closeHub(page, 'Multiworld');
  await base(page).getByText('No room is hosting right now.', { exact: true }).waitFor();
  for (const name of ['New session', 'Games', 'Presets']) await base(page).getByRole('button', { name, exact: true }).waitFor();
  await settledProof(launched, '02b-base-idle');
};

const openSettingsTab = (launched: LaunchedApp, tab: string) => openSection(hub(launched.page, 'Multiworld'), tab);

const visitSettingsTabs = async (launched: LaunchedApp) => {
  const settings = await openScreen(launched.page, 'Settings');
  const first = settings.getByRole('navigation', { name: 'Sections' }).getByRole('button', { name: 'General', exact: true });
  expect(await first.getAttribute('aria-current'), 'Settings opens Multiworld at the General page').toBe('page');
  for (const [index, [tab, text]] of SETTINGS_TABS.entries()) {
    const view = await openSettingsTab(launched, tab);
    await view.getByText(text, { exact: true }).waitFor();
    await settledProof(launched, `03-settings-${index + 1}-${tab.replace(/\W+/g, '-').toLowerCase()}`);
  }
};

const checkEngineTab = async (launched: LaunchedApp) => {
  const view = await openSettingsTab(launched, 'Engine');
  await view.getByText('Ready', { exact: true }).waitFor();
  await expect.poll(() => view.getByText('0.6.7', { exact: true }).count()).toBe(1);
  await view.getByRole('button', { name: 'Check again' }).waitFor();
};

const localPortInput = async (launched: LaunchedApp) =>
  (await openSettingsTab(launched, 'Hosting')).getByRole('spinbutton', { name: 'Local port', exact: true });

const setLocalPort = async (launched: LaunchedApp) => {
  const input = await localPortInput(launched);
  await input.fill(String(LOCAL_PORT));
  await input.blur();
  await settledProof(launched, '04-settings-hosting-port-set');
  await closeHub(launched.page, 'Multiworld');
  await openScreen(launched.page, 'Settings');
  const reopened = await localPortInput(launched);
  expect(await reopened.inputValue()).toBe(String(LOCAL_PORT));
  await settledProof(launched, '05-settings-hosting-port-kept');
  await closeHub(launched.page, 'Multiworld');
};

export { checkEngineTab, createProfile, setLocalPort, visitSettingsTabs };
