/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator, Page } from 'playwright-core';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { TEMPLATE } from '../../app/support/flow-constants';
import { dialogOf, openAdvanced, openScreen, pickOption, seatEditorOf, seatsOf } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { answerOpenDialogWith } from '../support/open-dialog';
import { BALDUR, RELIC, ROTP_B, TIMEOUT } from '../support/session-constants';

const OPEN_LAN = { title: 'Open this computer to your network?', confirm: 'Open to my network' };

const tabBody = (page: Page) => page.locator('.session-tabs__body');

const chooseLanWithDirect = async (sessions: Locator) => {
  const where = sessions.getByRole('radiogroup', { name: 'Where', exact: true });
  await where.getByRole('radio', { name: 'LAN', exact: true }).click();
  expect(await where.getByRole('radio', { name: 'LAN', exact: true }).getAttribute('aria-checked')).toBe('true');
  const direct = sessions.getByRole('switch', { name: /^Allow direct connections/ });
  await direct.press('Space');
  expect(await direct.getAttribute('aria-checked'), 'direct connections are on').toBe('true');
  const unlisted = sessions.getByRole('switch', { name: /^Allow unlisted clients/ });
  await unlisted.press('Space');
  expect(await unlisted.getAttribute('aria-checked'), 'unlisted clients are allowed').toBe('true');
};

const confirmLan = async (page: Page) => {
  const ask = dialogOf(page, OPEN_LAN.title);
  await ask.waitFor({ timeout: TIMEOUT.line });
  await ask.getByRole('button', { name: OPEN_LAN.confirm, exact: true }).click();
};

const openLobby = async (launched: LaunchedApp) => {
  const { page } = launched;
  const sessions = await openScreen(page, 'Sessions');
  await sessions.getByRole('button', { name: 'New session' }).click();
  await sessions.getByRole('textbox', { name: 'Session name' }).fill(TEMPLATE);
  await chooseLanWithDirect(sessions);
  await openAdvanced(sessions);
  await pickOption(page, sessions.getByRole('combobox', { name: 'Spoiler', exact: true }), 'Full with paths');
  await sessions.getByRole('button', { name: 'Save', exact: true }).click();
  await sessions.getByText('Saved', { exact: true }).waitFor();
  await settledProof(launched, '52-session-lan-direct-saved');
  await sessions.getByRole('button', { name: 'Run', exact: true }).click();
  await confirmLan(page);
  const tab = tabBody(page);
  await seatsOf(tab).waitFor();
  return tab;
};

const addSeat = async (tab: Locator, slot: number, name: string) => {
  await tab.getByRole('button', { name: 'Add player', exact: true }).click();
  const editor = seatEditorOf(tab, slot);
  await editor.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
  return editor;
};

const presetOf = (editor: Locator) => editor.getByRole('combobox', { name: 'Preset', exact: true });

const addSavedBaldur = async (page: Page, tab: Locator) => {
  const editor = await addSeat(tab, 1, BALDUR.slot);
  await pickOption(page, editor.getByRole('combobox', { name: 'Game', exact: true }), BALDUR.game);
  await pickOption(page, presetOf(editor), 'Create a default preset');
  await presetOf(editor).filter({ hasText: 'Default' }).waitFor();
  await editor.getByRole('button', { name: 'Done', exact: true }).click();
  await seatsOf(tab).getByRole('button', { name: new RegExp(`^Keep in session ${BALDUR.slot}`) }).click();
  await seatsOf(tab).getByText(/ · Saved$/).first().waitFor();
};

const addYamlRotpB = async (launched: LaunchedApp, tab: Locator) => {
  const { page } = launched;
  const editor = await addSeat(tab, 2, ROTP_B.slot);
  await pickOption(page, editor.getByRole('combobox', { name: 'Game', exact: true }), RELIC.game);
  await answerOpenDialogWith(launched.app, ROTP_B.yaml);
  await pickOption(page, presetOf(editor), 'Imported file');
  await editor.getByText(ROTP_B.fileName, { exact: true }).waitFor();
  await editor.getByRole('button', { name: 'Done', exact: true }).click();
  await seatsOf(tab).getByRole('button', { name: ROTP_B.slot, exact: true }).waitFor();
};

const buildLanSession = async (launched: LaunchedApp) => {
  const tab = await openLobby(launched);
  await addSavedBaldur(launched.page, tab);
  await addYamlRotpB(launched, tab);
  await settledProof(launched, '53-session-lobby-two-seats');
  return tab;
};

export { buildLanSession };
