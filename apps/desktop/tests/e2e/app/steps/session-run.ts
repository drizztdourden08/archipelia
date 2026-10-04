/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator, Page } from 'playwright-core';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { LOCAL_PORT, SOH, TEMPLATE, TIMESPINNER } from '../support/flow-constants';
import { base, dialogOf, docked, hub, openScreen, pickOption, playerRowOf } from '../support/locators';

const RUN_TIMEOUT = 300000;

type PlayerPlan = { slot: number; name: string; game: string; preset: string };

const PLAYERS: PlayerPlan[] = [
  { slot: 1, name: SOH.slot, game: SOH.game, preset: SOH.preset },
  { slot: 2, name: TIMESPINNER.slot, game: TIMESPINNER.game, preset: TIMESPINNER.preset },
];

const fillPlayer = async (page: Page, builder: Locator, { slot, name, game, preset }: PlayerPlan) => {
  await builder.getByRole('button', { name: 'Add player' }).click();
  const row = playerRowOf(builder, slot);
  await row.getByRole('textbox', { name: `Name of player ${slot}`, exact: true }).fill(name);
  await pickOption(page, row.getByRole('combobox', { name: `Game of player ${slot}: none`, exact: true }), game);
  await row.getByRole('combobox', { name: `Preset of player ${slot}: ${preset}`, exact: true }).waitFor();
  for (const action of ['Edit', 'Duplicate', 'Remove']) {
    await row.getByRole('button', { name: `${action} player ${slot}`, exact: true }).waitFor();
  }
};

const DISCARD_TEXT = 'This page has changes that are not saved. Leave it and lose them?';

const keepEditing = async (page: Page, sessions: Locator) => {
  const back = sessions.getByRole('button', { name: 'Back to Sessions', exact: true });
  const discard = dialogOf(page, 'Discard changes?');
  await back.click();
  await discard.getByText(DISCARD_TEXT).waitFor();
  await discard.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await discard.waitFor({ state: 'detached' });
  await back.focus();
  await page.keyboard.press('Escape');
  await discard.getByText(DISCARD_TEXT).waitFor();
  await page.keyboard.press('Escape');
  await discard.waitFor({ state: 'detached' });
  await hub(page, 'Multiworld').waitFor();
};

const buildSession = async (launched: LaunchedApp) => {
  const { page } = launched;
  const sessions = await openScreen(page, 'Sessions');
  await sessions.getByText('No session yet. New session builds one.').waitFor();
  await sessions.getByRole('button', { name: 'New session' }).click();
  await sessions.getByText('Add at least one player').waitFor();
  await settledProof(launched, '18-sessions-new');
  for (const player of PLAYERS) await fillPlayer(page, sessions, player);
  await keepEditing(page, sessions);
  expect(await sessions.getByRole('spinbutton', { name: 'Local port', exact: true }).inputValue()).toBe(String(LOCAL_PORT));
  const host = sessions.getByRole('radiogroup', { name: 'Host', exact: true });
  expect(await host.getByRole('radio', { name: 'This computer', exact: true }).getAttribute('aria-checked')).toBe('true');
  await sessions.getByRole('slider', { name: 'Hint cost', exact: true }).waitFor();
  await pickOption(page, sessions.getByRole('combobox', { name: 'Spoiler', exact: true }), 'Full with paths');
  await sessions.getByRole('textbox', { name: 'Session name' }).fill(TEMPLATE);
  await settledProof(launched, '19-sessions-two-players');
  await sessions.getByRole('button', { name: 'Save', exact: true }).click();
  await sessions.getByText('Saved', { exact: true }).waitFor();
  await settledProof(launched, '20-sessions-saved');
  return sessions;
};

const runSession = async (launched: LaunchedApp, sessions: Locator) => {
  const { page } = launched;
  await sessions.getByRole('button', { name: 'Run', exact: true }).click();
  const progress = page.getByRole('dialog', { name: `Running ${TEMPLATE}` });
  await progress.getByText('Rolling 2 player files').waitFor();
  await settledProof(launched, '21-run-progress');
  await hub(page, 'Multiworld').waitFor({ state: 'detached', timeout: RUN_TIMEOUT });
  const dashboard = base(page);
  await dashboard.getByText(/^hosting$/i).first().waitFor({ timeout: RUN_TIMEOUT });
  await dashboard.getByText(new RegExp(`^[\\w.-]+:${LOCAL_PORT}$`)).first().waitFor();
  await docked(page).getByText(/_Spoiler\.txt$/).waitFor();
  await page.getByText(`Hosting: ${TEMPLATE}`, { exact: true }).filter({ visible: true }).first().waitFor();
  await settledProof(launched, '22-dashboard-hosting');
  return dashboard;
};

const buildAndRun = async (launched: LaunchedApp) => runSession(launched, await buildSession(launched));

export { buildAndRun };
