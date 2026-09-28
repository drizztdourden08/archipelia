/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { LaunchedApp } from '../support/launch-app';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT, PROFILE } from '../support/flow-constants';
import { closeLayer, layer, nestedButtons, openScreen } from '../support/locators';

const SETTINGS_TABS: [string, string][] = [
  ['General', 'Open in fullscreen on launch.'],
  ['Engine', 'Archipelago'],
  ['Hosting', 'Players connect to this computer on this port.'],
  ['archipelago.gg', 'Change only for a self-hosted copy of the Archipelago website.'],
];

const createProfile = async (launched: LaunchedApp) => {
  const { page } = launched;
  const profiles = layer(page, 'Profiles');
  await profiles.getByText('Create a profile to get started.').waitFor();
  await settledProof(launched, '01-profiles-first-boot');
  await profiles.getByRole('textbox', { name: 'Profile name' }).fill(PROFILE);
  await profiles.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('heading', { name: 'Good to go', level: 1 }).waitFor();
  await expect.poll(() => page.getByText(/Engine AP 0\.6\.7 ready/).count()).toBe(1);
  expect(await nestedButtons(page), 'no button inside a button on Home').toBe(0);
  await settledProof(launched, '02-home-engine-ready');
};

const sectionNav = (launched: LaunchedApp) => launched.page.getByRole('navigation', { name: 'Sections' });

const openSettingsTab = async (launched: LaunchedApp, tab: string) => {
  await sectionNav(launched).getByRole('button', { name: tab, exact: true }).click();
  return layer(launched.page, 'Settings');
};

const visitSettingsTabs = async (launched: LaunchedApp) => {
  const settings = await openScreen(launched.page, 'Settings');
  await settings.getByText(PROFILE, { exact: true }).waitFor();
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
  await closeLayer(launched.page, 'Settings');
  await layer(launched.page, 'Settings').waitFor({ state: 'detached' });
  await openScreen(launched.page, 'Settings');
  const reopened = await localPortInput(launched);
  expect(await reopened.inputValue()).toBe(String(LOCAL_PORT));
  await settledProof(launched, '05-settings-hosting-port-kept');
  await closeLayer(launched.page, 'Settings');
};

export { checkEngineTab, createProfile, setLocalPort, visitSettingsTabs };
