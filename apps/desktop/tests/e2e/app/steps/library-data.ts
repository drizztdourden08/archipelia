/* @layer tests @kind helper */
import { stat } from 'node:fs/promises';
import { expect } from 'vitest';
import type { LaunchedApp } from '../support/launch-app';
import { settledProof } from '../support/settled-proof';
import { exportPath, LOCAL_PORT, TEMPLATE } from '../support/flow-constants';
import { closeLayer, layer, nestedButtons, openScreen, shownOpacity } from '../support/locators';
import { answerSaveDialogWith } from '../support/save-dialog';

const DATA_ROWS = ['Sessions', 'Presets', 'Installed games'];

const checkHistory = async (launched: LaunchedApp) => {
  await closeLayer(launched.page, 'Session');
  const sessions = await openScreen(launched.page, 'Sessions');
  const back = sessions.getByRole('button', { name: 'Back to sessions' });
  if (await back.count()) await back.click();
  await sessions.getByText('History · 1').waitFor();
  const template = sessions.getByRole('button', { name: new RegExp(`^${TEMPLATE} .*local :${LOCAL_PORT} · spoiler full`) });
  await template.waitFor();
  const run = sessions.getByRole('list', { name: 'Runs', exact: true }).getByRole('listitem').filter({ hasText: TEMPLATE });
  await run.getByRole('button', { name: new RegExp(`^${TEMPLATE} .* · local`) }).waitFor();
  for (const shown of [run.getByText('stopped', { exact: true }), run.getByRole('button', { name: 'Delete', exact: true }), run.getByRole('button', { name: 'Open', exact: true })]) {
    await expect.poll(() => shownOpacity(shown), { message: 'history row status and actions show without hover' }).toBe(1);
  }
  expect(await nestedButtons(launched.page), 'no button inside a button on Home or Sessions').toBe(0);
  await settledProof(launched, '28-sessions-history-stopped');
  await closeLayer(launched.page, 'Sessions');
};

const sizeOfRow = async (launched: LaunchedApp, row: string) => {
  const text = (await layer(launched.page, 'Data').innerText()).replace(/\s+/g, ' ');
  return new RegExp(`${row} Files (\\d+) Size ([\\d.]+ [KMG]?B)`).exec(text);
};

const checkDataAndExport = async (launched: LaunchedApp) => {
  const data = await openScreen(launched.page, 'Data');
  await data.getByRole('button', { name: 'Export presets and templates' }).waitFor();
  await data.getByText('Installed games', { exact: true }).waitFor();
  for (const row of DATA_ROWS) {
    const found = await sizeOfRow(launched, row);
    expect(found, `${row} row`).not.toBeNull();
    expect(Number(found?.[1])).toBeGreaterThan(0);
  }
  await settledProof(launched, '29-data-sizes');
  const target = exportPath(launched.userData, 'archipelia-library.zip');
  await answerSaveDialogWith(launched.app, target);
  await data.getByRole('button', { name: 'Export presets and templates' }).click();
  await data.getByRole('status').filter({ hasText: 'Saved archipelia-library.zip' }).waitFor();
  expect((await stat(target)).size).toBeGreaterThan(0);
  await settledProof(launched, '30-data-exported');
  await closeLayer(launched.page, 'Data');
};

export { checkDataAndExport, checkHistory };
