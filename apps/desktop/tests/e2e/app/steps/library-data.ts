/* @layer tests @kind helper */
import { stat } from 'node:fs/promises';
import { expect } from 'vitest';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { exportPath, TEMPLATE } from '../support/flow-constants';
import { base, closeHub, dialogOf, hub, nestedButtons, openScreen, shownOpacity } from '../support/locators';
import { answerSaveDialogWith } from '../support/save-dialog';

const checkHistory = async (launched: LaunchedApp) => {
  const { page } = launched;
  const history = await openScreen(page, 'History');
  await history.getByText('1 of 1', { exact: true }).waitFor();
  const row = history.getByRole('button', { name: new RegExp(`^${TEMPLATE}\\b`) });
  await row.waitFor();
  await history.getByText(new RegExp(`^from ${TEMPLATE}`)).first().waitFor();
  await row.click();
  await history.getByRole('region', { name: 'Source', exact: true }).waitFor();
  const open = history.getByRole('button', { name: `Open run ${TEMPLATE}`, exact: true });
  for (const shown of [history.getByText('Stopped', { exact: true }).first(), history.getByRole('button', { name: `Delete run ${TEMPLATE}`, exact: true }), open]) {
    await expect.poll(() => shownOpacity(shown), { message: 'run status and actions show without hover' }).toBe(1);
  }
  expect(await nestedButtons(page), 'no button inside a button on History').toBe(0);
  await settledProof(launched, '28-history-stopped');
  await open.click();
  await hub(page, 'Multiworld').waitFor({ state: 'detached' });
  await base(page).getByText(TEMPLATE, { exact: true }).first().waitFor();
};

const exportData = async (launched: LaunchedApp) => {
  const { page } = launched;
  await openScreen(page, 'Storage');
  const target = exportPath(launched.userData, 'archipelia-data.zip');
  await answerSaveDialogWith(launched.app, target);
  await hub(page, 'Multiworld').getByRole('button', { name: 'Export to zip', exact: true }).click();
  await page.getByText(/^Exported \d+ files? .* to /).first().waitFor();
  expect((await stat(target)).size).toBeGreaterThan(0);
  await settledProof(launched, '30-data-exported');
  const job = dialogOf(page, 'Exporting data');
  if (await job.count()) await job.getByRole('button', { name: 'Close', exact: true }).last().click();
  await closeHub(page, 'Multiworld');
};

export { checkHistory, exportData };
