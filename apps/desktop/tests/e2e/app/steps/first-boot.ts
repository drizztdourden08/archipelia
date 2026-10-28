/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT } from '../support/flow-constants';
import { base, closeHub, dialogOf, hub, nestedButtons, openScreen, openSection } from '../support/locators';

const SETUP_STEPS: [string, string][] = [['Engine', 'Done'], ['Games', 'To do'], ['Preset', 'To do'], ['Session', 'To do']];

const bootWithDefaultProfile = async (launched: LaunchedApp) => {
  const { page } = launched;
  const home = hub(page, 'Multiworld');
  await home.getByRole('heading', { name: 'Add your first game', level: 2, exact: true }).waitFor();
  expect(await dialogOf(page, 'Profiles').count(), 'the Default profile skips the profiles dialog').toBe(0);
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
  await base(page).getByText('No session is open. Run a session to open it here.', { exact: true }).waitFor();
  for (const name of ['Open Sessions', 'New session', 'Join a session']) await base(page).getByRole('button', { name, exact: true }).waitFor();
  await settledProof(launched, '02b-base-idle');
};

const openSettingsTab = (launched: LaunchedApp, tab: string) => openSection(hub(launched.page, 'Multiworld'), tab);

const localPortInput = async (launched: LaunchedApp) =>
  (await openSettingsTab(launched, 'Hosting')).getByRole('spinbutton', { name: 'Local port', exact: true });

const setLocalPort = async (launched: LaunchedApp) => {
  await openScreen(launched.page, 'Settings');
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

export { bootWithDefaultProfile, setLocalPort };
