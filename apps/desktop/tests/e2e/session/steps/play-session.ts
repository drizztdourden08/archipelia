/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator, Page } from 'playwright-core';
import { runSession } from '../../app/steps/session-run';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { TEMPLATE } from '../../app/support/flow-constants';
import { docked } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { roomTargetOf } from '../support/app-api';
import { chestLineOf, itemOf } from '../support/chest-line';
import type { ChestItem } from '../support/chest-line';
import { apConnectArgs } from '../support/rotp-args';
import { startRotp, waitForChestItem } from '../support/rotp-instance';
import type { RotpInstance } from '../support/rotp-instance';
import { ROTP_B, TIMEOUT } from '../support/session-constants';
import type { SessionEnv } from '../support/session-env';
import type { SessionDirs } from './session-dirs.type';

const playerRow = (widgets: Locator, slot: string) =>
  widgets.getByRole('list', { name: 'Players', exact: true }).getByRole('listitem').filter({ hasText: slot });

const hostSession = async (launched: LaunchedApp, tab: Locator) => runSession(launched, tab);

const startRotpB = async (launched: LaunchedApp, env: SessionEnv, dirs: SessionDirs): Promise<RotpInstance> => {
  const target = await roomTargetOf(launched, TEMPLATE, ROTP_B.slot);
  const instance = (eventLog: string) => ({ instance: env.instanceB, eventLog, profileName: ROTP_B.slot });
  return startRotp({ name: ROTP_B.slot, command: env.cli, args: (eventLog) => apConnectArgs(instance(eventLog), target), outDir: dirs.logs });
};

const waitForChest = (instance: RotpInstance) => waitForChestItem(instance, TIMEOUT.chest);

const chestResultOf = async (widgets: Locator, slot: string): Promise<ChestItem> => {
  const line = widgets.getByText(chestLineOf(slot)).first();
  await line.waitFor({ timeout: TIMEOUT.line });
  return itemOf(slot, await line.innerText());
};

const checkResults = async (launched: LaunchedApp, slots: string[]): Promise<ChestItem[]> => {
  const widgets = docked(launched.page);
  for (const slot of slots) await playerRow(widgets, slot).getByText('connected', { exact: true }).waitFor({ timeout: TIMEOUT.line });
  const results: ChestItem[] = [];
  for (const slot of slots) results.push(await chestResultOf(widgets, slot));
  await settledProof(launched, '60-session-chest-results');
  return results;
};

const hintCount = (widgets: Locator) => widgets.getByRole('list', { name: 'Hints', exact: true }).getByRole('listitem').count();

const sendHints = async (launched: LaunchedApp, results: ChestItem[]) => {
  const page = launched.page;
  const widgets = docked(page);
  const consoleWidget = page.locator('[data-widget-id="console"]');
  const command = consoleWidget.getByRole('combobox', { name: 'Server command', exact: true });
  for (const [index, result] of results.entries()) {
    const text = `/hint ${result.receiver} ${result.item}`;
    await command.fill(text);
    await command.press('Enter');
    await consoleWidget.getByText(`> ${text}`, { exact: true }).waitFor();
    await expect.poll(() => hintCount(widgets), { timeout: TIMEOUT.line }).toBeGreaterThan(index);
  }
  await settledProof(launched, '61-session-hints');
};

const openSpoilerWidget = async (page: Page) => {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Widgets', exact: true }).click();
  await page.locator('[role^="menuitem"]', { hasText: /Spoiler/ }).first().click();
  const frame = page.locator('[data-widget-id="spoiler"]');
  await frame.waitFor();
  return frame;
};

const checkSpoiler = async (launched: LaunchedApp, slots: string[]) => {
  const frame = await openSpoilerWidget(launched.page);
  await frame.getByRole('button', { name: 'Show spoiler' }).click();
  await frame.getByRole('button', { name: 'Hide spoiler' }).waitFor();
  for (const slot of slots) await frame.getByText(slot).first().waitFor({ timeout: TIMEOUT.line });
  await settledProof(launched, '62-session-spoiler');
  await frame.getByRole('button', { name: 'Hide spoiler' }).click();
  await frame.getByRole('button', { name: 'Show spoiler' }).waitFor();
};

const checkRoom = async (launched: LaunchedApp) => {
  const room = launched.page.locator('[data-widget-id="room"]');
  for (const label of ['Host', 'Address', 'Password', 'Seed']) await room.getByText(label, { exact: true }).waitFor();
  await room.getByText(/^Files \(\d+\)$/).waitFor();
  await settledProof(launched, '63-session-room');
};

const checkConsole = async (launched: LaunchedApp) => {
  const consoleWidget = launched.page.locator('[data-widget-id="console"]');
  await consoleWidget.getByRole('button', { name: 'Players', exact: true }).click();
  await consoleWidget.getByText(/players of \d+ connected/).first().waitFor({ timeout: TIMEOUT.line });
  await consoleWidget.getByRole('button', { name: 'Save', exact: true }).click();
  await settledProof(launched, '64-session-console');
};

export { checkConsole, checkResults, checkRoom, checkSpoiler, hostSession, sendHints, startRotpB, waitForChest };
