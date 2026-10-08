/* @layer tests @kind helper */
import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { exportPath, SOH, TIMESPINNER } from '../support/flow-constants';
import { closeHub, openScreen, pickOption } from '../support/locators';
import { answerSaveDialogWith } from '../support/save-dialog';

const rowOf = (presets: Locator, name: string, changed: number) =>
  presets.getByRole('button', { name: new RegExp(`^${name} ${changed} changed`) });

const createForm = (presets: Locator) => presets.getByRole('group', { name: 'New preset', exact: true });

const newPresetFor = async (presets: Locator, game: string) => {
  await presets.getByRole('group', { name: game, exact: true }).getByRole('button', { name: 'New preset', exact: true }).click();
  await createForm(presets).getByRole('combobox', { name: 'Game', exact: true }).filter({ hasText: game }).waitFor();
};

const newPresetPicking = async (launched: LaunchedApp, presets: Locator, game: string) => {
  await presets.locator('[data-tour="new-preset"]').click();
  await pickOption(launched.page, createForm(presets).getByRole('combobox', { name: 'Game', exact: true }), game);
};

const createPreset = async (presets: Locator, name: string) => {
  const form = createForm(presets);
  await form.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
  await form.getByRole('button', { name: 'Create', exact: true }).click();
  await form.waitFor({ state: 'detached' });
  await rowOf(presets, name, 0).waitFor();
};

const findOption = async (presets: Locator, label: string) => {
  await presets.getByRole('tab', { name: /^All\b/ }).click();
  await presets.getByRole('searchbox', { name: 'Search options' }).fill(label);
  await presets.getByRole('button', { name: `Reset ${label}`, exact: true }).waitFor();
};

const markedChanged = (presets: Locator, label: string) =>
  presets.getByRole('button', { name: `Reset ${label}`, exact: true, disabled: false }).waitFor();

const save = async (presets: Locator, name: string) => {
  await presets.getByRole('button', { name: 'Save', exact: true }).click();
  await presets.getByRole('status').filter({ hasText: /^\s*Saved\s*$/ }).waitFor();
  await rowOf(presets, name, 1).waitFor();
};

const sohPreset = async (launched: LaunchedApp, presets: Locator) => {
  await newPresetFor(presets, SOH.game);
  await createPreset(presets, SOH.preset);
  await settledProof(launched, '12-presets-soh-created');
  await findOption(presets, SOH.toggle);
  const toggle = presets.getByRole('switch', { name: SOH.toggle, exact: true });
  await toggle.press('Space');
  expect(await toggle.isChecked()).toBe(true);
  await markedChanged(presets, SOH.toggle);
  await presets.getByRole('status').filter({ hasText: 'Unsaved changes' }).waitFor();
  await settledProof(launched, '13-presets-soh-toggle-changed');
  await save(presets, SOH.preset);
};

const timespinnerPreset = async (launched: LaunchedApp, presets: Locator) => {
  await newPresetPicking(launched, presets, TIMESPINNER.game);
  await createPreset(presets, TIMESPINNER.preset);
  await findOption(presets, TIMESPINNER.choice);
  await pickOption(launched.page, presets.getByRole('combobox', { name: TIMESPINNER.choice, exact: true }), TIMESPINNER.value);
  await markedChanged(presets, TIMESPINNER.choice);
  await settledProof(launched, '14-presets-timespinner-choice-changed');
  await save(presets, TIMESPINNER.preset);
};

const reopenAndSeeChanges = async (launched: LaunchedApp) => {
  await closeHub(launched.page, 'Multiworld');
  const presets = await openScreen(launched.page, 'Presets');
  await rowOf(presets, SOH.preset, 1).click();
  await findOption(presets, SOH.toggle);
  await markedChanged(presets, SOH.toggle);
  expect(await presets.getByRole('switch', { name: SOH.toggle, exact: true }).isChecked()).toBe(true);
  await settledProof(launched, '15-presets-soh-reopened');
  await rowOf(presets, TIMESPINNER.preset, 1).click();
  await findOption(presets, TIMESPINNER.choice);
  await markedChanged(presets, TIMESPINNER.choice);
  await presets.getByRole('combobox', { name: TIMESPINNER.choice, exact: true }).filter({ hasText: TIMESPINNER.value }).waitFor();
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
