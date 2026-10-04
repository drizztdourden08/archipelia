/* @layer tests @kind helper */
import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { exportPath, SOH, TIMESPINNER } from '../support/flow-constants';
import { closeHub, dialogOf, openScreen, optionRowOf, pickOption } from '../support/locators';
import { answerSaveDialogWith } from '../support/save-dialog';

const newPreset = async (launched: LaunchedApp, presets: Locator, game: string, name: string) => {
  const { page } = launched;
  await presets.getByRole('button', { name: 'New preset', exact: true }).click();
  const dialog = dialogOf(page, 'New preset');
  await pickOption(page, dialog.getByRole('combobox', { name: 'Game', exact: true }), game);
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
  await dialog.getByRole('button', { name: 'Create' }).click();
  await dialog.waitFor({ state: 'detached' });
  await presets.getByRole('button', { name: new RegExp(`^${name} 0 changed`) }).waitFor();
};

const findOption = async (presets: Locator, label: string) => {
  await presets.getByRole('tab', { name: /^All \d+$/ }).click();
  await presets.getByRole('searchbox', { name: 'Search options' }).fill(label);
  return optionRowOf(presets, label);
};

const save = async (presets: Locator, name: string) => {
  await presets.getByRole('button', { name: 'Save' }).click();
  await presets.getByRole('button', { name: new RegExp(`^${name} 1 changed`) }).waitFor();
};

const sohPreset = async (launched: LaunchedApp, presets: Locator) => {
  await newPreset(launched, presets, SOH.game, SOH.preset);
  await settledProof(launched, '12-presets-soh-created');
  const row = await findOption(presets, SOH.toggle);
  const toggle = row.getByRole('switch', { name: SOH.toggle, exact: true });
  await toggle.press('Space');
  expect(await toggle.isChecked()).toBe(true);
  await row.getByText('changed', { exact: true }).waitFor();
  await settledProof(launched, '13-presets-soh-toggle-changed');
  await save(presets, SOH.preset);
};

const timespinnerPreset = async (launched: LaunchedApp, presets: Locator) => {
  await newPreset(launched, presets, TIMESPINNER.game, TIMESPINNER.preset);
  const row = await findOption(presets, TIMESPINNER.choice);
  await pickOption(launched.page, row.getByRole('combobox', { name: new RegExp(`^${TIMESPINNER.choice}: `) }), TIMESPINNER.value);
  await row.getByText('changed', { exact: true }).waitFor();
  await settledProof(launched, '14-presets-timespinner-choice-changed');
  await save(presets, TIMESPINNER.preset);
};

const reopenAndSeeChanges = async (launched: LaunchedApp) => {
  await closeHub(launched.page, 'Multiworld');
  const presets = await openScreen(launched.page, 'Presets');
  await presets.getByRole('button', { name: new RegExp(`^${SOH.preset} 1 changed`) }).click();
  const sohRow = await findOption(presets, SOH.toggle);
  await sohRow.getByText('changed', { exact: true }).waitFor();
  expect(await sohRow.getByRole('switch', { name: SOH.toggle, exact: true }).isChecked()).toBe(true);
  await settledProof(launched, '15-presets-soh-reopened');
  await presets.getByRole('button', { name: new RegExp(`^${TIMESPINNER.preset} 1 changed`) }).click();
  const tsRow = await findOption(presets, TIMESPINNER.choice);
  await tsRow.getByText('changed', { exact: true }).waitFor();
  await tsRow.getByRole('combobox', { name: `${TIMESPINNER.choice}: ${TIMESPINNER.value}`, exact: true }).waitFor();
  await tsRow.getByRole('button', { name: `Reset ${TIMESPINNER.choice}`, exact: true }).waitFor();
  await settledProof(launched, '16-presets-timespinner-reopened');
  return presets;
};

const exportYaml = async (launched: LaunchedApp, presets: Locator) => {
  const target = exportPath(launched.userData, 'timespinner-e2e.yaml');
  await answerSaveDialogWith(launched.app, target);
  await presets.getByRole('button', { name: 'More actions' }).click();
  await launched.page.getByRole('menuitem', { name: 'Export YAML' }).click();
  await presets.getByText(/^Exported /).waitFor();
  const yaml = await readFile(target, 'utf8');
  expect(yaml).toContain('Timespinner');
  expect(yaml.toLowerCase()).toContain('scaled');
  await settledProof(launched, '17-presets-yaml-exported');
};

const buildPresets = async (launched: LaunchedApp) => {
  const presets = await openScreen(launched.page, 'Presets');
  await sohPreset(launched, presets);
  await timespinnerPreset(launched, presets);
  const reopened = await reopenAndSeeChanges(launched);
  await exportYaml(launched, reopened);
  await closeHub(launched.page, 'Multiworld');
};

export { buildPresets };
