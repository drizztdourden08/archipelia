/* @layer tests @kind helper */
import { stat } from 'node:fs/promises';
import { expect } from 'vitest';
import type { LaunchedApp } from '../support/launched-app.type';
import { settledProof } from '../support/settled-proof';
import { exportPath, LOCAL_PORT, TEMPLATE } from '../support/flow-constants';
import { base, closeHub, dialogOf, hub, nestedButtons, openScreen, shownOpacity } from '../support/locators';
import { answerSaveDialogWith } from '../support/save-dialog';

const checkHistory = async (launched: LaunchedApp) => {
  const { page } = launched;
  const sessions = await openScreen(page, 'Sessions');
  const back = sessions.getByRole('button', { name: 'Back to Sessions', exact: true });
  if (await back.count()) await back.click();
  await sessions.getByText('Runs · 1').waitFor();
  const template = sessions.getByRole('button', { name: new RegExp(`^${TEMPLATE} .*local :${LOCAL_PORT} · spoiler full`) });
  await template.waitFor();
  const run = sessions.getByRole('list', { name: 'Runs', exact: true }).getByRole('listitem').filter({ hasText: TEMPLATE });
  await run.getByRole('button', { name: new RegExp(`^${TEMPLATE} .* · local`) }).waitFor();
  const open = run.getByRole('button', { name: 'Open', exact: true });
  for (const shown of [run.getByText('Stopped', { exact: true }), run.getByRole('button', { name: 'Delete', exact: true }), open]) {
    await expect.poll(() => shownOpacity(shown), { message: 'run row status and actions show without hover' }).toBe(1);
  }
  expect(await nestedButtons(page), 'no button inside a button on Home or Sessions').toBe(0);
  await settledProof(launched, '28-sessions-runs-stopped');
  await open.click();
  await hub(page, 'Multiworld').waitFor({ state: 'detached' });
  await base(page).getByText(TEMPLATE, { exact: true }).first().waitFor();
};

const exportData = async (launched: LaunchedApp) => {
  const { page } = launched;
  await openScreen(page, 'Data');
  const target = exportPath(launched.userData, 'archipelia-data.zip');
  await answerSaveDialogWith(launched.app, target);
  await hub(page, 'Data').getByRole('button', { name: 'Export to zip', exact: true }).click();
  await page.getByText(/^Exported \d+ files? .* to /).first().waitFor();
  expect((await stat(target)).size).toBeGreaterThan(0);
  await settledProof(launched, '30-data-exported');
  const job = dialogOf(page, 'Exporting data');
  if (await job.count()) await job.getByRole('button', { name: 'Close', exact: true }).last().click();
  await closeHub(page, 'Data');
};

export { checkHistory, exportData };
