/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import { OPTIONS_UI } from '../../../../src/review/review.constants';
import { OPTION_TEXT } from '../../../../src/views/LobbyMembers/LobbyMembers.constants';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { TEMPLATE } from '../../app/support/flow-constants';
import { dialogOf } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { lobbyTargetOf } from '../support/app-api';
import { lobbyJoinArgs } from '../support/rotp-args';
import { startRotp } from '../support/rotp-instance';
import type { RotpInstance } from '../support/rotp-instance';
import { RELIC, ROTP_A, TIMEOUT } from '../support/session-constants';
import type { SessionEnv } from '../support/session-env';
import type { SessionDirs } from './session-dirs.type';

const EDITABLE_ROLES = ['textbox', 'combobox', 'switch', 'slider', 'spinbutton', 'checkbox', 'radio'] as const;

const startRotpA = async (launched: LaunchedApp, env: SessionEnv, dirs: SessionDirs): Promise<RotpInstance> => {
  const target = await lobbyTargetOf(launched, TEMPLATE);
  const instance = (eventLog: string) => ({ instance: env.instanceA, eventLog, profileName: ROTP_A.slot });
  return startRotp({ name: ROTP_A.slot, command: env.cli, args: (eventLog) => lobbyJoinArgs(instance(eventLog), target), outDir: dirs.logs });
};

const waitForJoinRequest = async (launched: LaunchedApp, tab: Locator): Promise<Locator> => {
  const approve = tab.getByRole('button', { name: /^Approve / });
  await approve.waitFor({ timeout: TIMEOUT.join });
  const seat = tab.locator('.lobby-seat').filter({ has: approve });
  await seat.getByText('Waiting for your approval').waitFor();
  await seat.getByText(RELIC.game).first().waitFor();
  await settledProof(launched, '54-lobby-join-request');
  return approve;
};

const approveJoin = async (launched: LaunchedApp, tab: Locator) => {
  const approve = await waitForJoinRequest(launched, tab);
  await approve.click();
  await tab.getByRole('button', { name: /^Remove / }).first().waitFor({ timeout: TIMEOUT.join });
  await tab.getByText(/Joined/).first().waitFor();
  await settledProof(launched, '55-lobby-join-approved');
};

const expectNoInputs = async (dialog: Locator) => {
  for (const role of EDITABLE_ROLES) expect(await dialog.getByRole(role).count(), `the options dialog has no ${role}`).toBe(0);
};

const checkJoinedOptions = async (launched: LaunchedApp, tab: Locator) => {
  await tab.getByRole('button', { name: `${OPTIONS_UI.view} ${ROTP_A.slot}`, exact: true }).click();
  const dialog = dialogOf(launched.page, OPTIONS_UI.title(ROTP_A.slot));
  await dialog.waitFor();
  await dialog.getByText(OPTION_TEXT.readOnly, { exact: true }).waitFor();
  await dialog.getByText(OPTION_TEXT.loading, { exact: true }).waitFor({ state: 'hidden', timeout: TIMEOUT.line });
  for (const problem of [OPTION_TEXT.failed, OPTION_TEXT.notSent, OPTION_TEXT.unreadable, OPTION_TEXT.noOptions(RELIC.game)]) {
    expect(await dialog.getByText(problem, { exact: true }).count(), `the options of ${ROTP_A.slot} load: "${problem}" is not shown`).toBe(0);
  }
  const raw = dialog.getByText(OPTION_TEXT.raw, { exact: true });
  await raw.waitFor();
  await raw.click();
  await dialog.getByText(RELIC.game).first().waitFor();
  await expectNoInputs(dialog);
  await settledProof(launched, '56-lobby-joined-options-read-only');
  await dialog.getByRole('button', { name: OPTIONS_UI.close, exact: true }).last().click();
  await dialog.waitFor({ state: 'detached' });
};

export { approveJoin, checkJoinedOptions, startRotpA };
