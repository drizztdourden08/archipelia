/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import { OPTIONS_UI } from '../../../../src/review/review.constants';
import { MEMBER_TEXT, OPTION_TEXT } from '../../../../src/views/LobbyMembers/LobbyMembers.constants';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { TEMPLATE } from '../../app/support/flow-constants';
import { dialogOf } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { lobbyTargetOf } from '../support/app-api';
import { joinRefusalOf } from '../support/rotp-console';
import { lobbyJoinArgs } from '../support/rotp-args';
import { startRotp } from '../support/rotp-instance';
import type { RotpInstance } from '../support/rotp-instance';
import { RELIC, ROTP_A, TIMEOUT } from '../support/session-constants';
import type { SessionEnv } from '../support/session-env';
import type { SessionDirs } from './session-dirs.type';

const EDITABLE_ROLES = ['textbox', 'combobox', 'switch', 'slider', 'spinbutton', 'checkbox', 'radio'] as const;

const POLL_MS = 500;

const pause = (ms: number) => new Promise<void>((resolve) => { setTimeout(resolve, ms); });

const APPROVE_NAME = /^Approve /;

const approveOf = (tab: Locator) => tab.getByRole('button', { name: APPROVE_NAME });

const startRotpA = async (launched: LaunchedApp, env: SessionEnv, dirs: SessionDirs, name: string = ROTP_A.slot): Promise<RotpInstance> => {
  const target = await lobbyTargetOf(launched, TEMPLATE);
  const instance = (eventLog: string) => ({ instance: env.instanceA, eventLog, profileName: ROTP_A.slot });
  return startRotp({ name, cwd: env.rotpDir, args: (eventLog) => lobbyJoinArgs(instance(eventLog), target), outDir: dirs.logs });
};

const waitJoinReached = async (tab: Locator, rotp: RotpInstance, until = Date.now() + TIMEOUT.join): Promise<void> => {
  if (rotp.exited()) throw new Error(`${rotp.name} ended before its join reached the host. Its output ends: ${rotp.output().slice(-2000)}`);
  if (await approveOf(tab).count() > 0) return;
  const refusal = await joinRefusalOf(rotp.eventLog);
  if (refusal !== undefined) throw new Error(`${rotp.name} refused to join: ${refusal}`);
  if (Date.now() > until) throw new Error(`the join of ${rotp.name} never reached the host in ${TIMEOUT.join} ms. Its output ends: ${rotp.output().slice(-2000)}`);
  await pause(POLL_MS);
  await waitJoinReached(tab, rotp, until);
};

const waitForJoinRequest = async (launched: LaunchedApp, tab: Locator, rotp: RotpInstance) => {
  await waitJoinReached(tab, rotp);
  const seat = tab.locator('.lobby-seat').filter({ has: tab.page().getByRole('button', { name: APPROVE_NAME }) });
  await seat.getByText('Waiting for your approval').waitFor();
  await seat.getByText(RELIC.game).first().waitFor();
  expect(rotp.exited(), `${rotp.name} is still running once its join reached the host`).toBe(false);
  await settledProof(launched, '54-lobby-join-request');
};

const CONSENT_NAME = `${MEMBER_TEXT.review} ${ROTP_A.slot}`;

const ALLOW_WORLD = 'Allow this world';

const NEEDS_CONSENT = 'Needs your consent';

const consentToWorld = async (tab: Locator) => {
  await tab.getByRole('button', { name: CONSENT_NAME, exact: true }).click();
  await tab.page().getByRole('button', { name: ALLOW_WORLD, exact: true }).click();
  const seat = tab.locator('.lobby-seat').filter({ hasText: ROTP_A.slot });
  await seat.getByText(NEEDS_CONSENT).waitFor({ state: 'detached', timeout: TIMEOUT.join });
  await seat.getByText(MEMBER_TEXT.ready, { exact: true }).first().waitFor({ timeout: TIMEOUT.join });
};

const approveJoin = async (launched: LaunchedApp, tab: Locator, rotp: RotpInstance) => {
  await approveOf(tab).click();
  await tab.getByRole('button', { name: `${MEMBER_TEXT.remove} ${ROTP_A.slot}`, exact: true }).waitFor({ timeout: TIMEOUT.join });
  await tab.getByText(/Joined/).first().waitFor();
  await consentToWorld(tab);
  expect(rotp.exited(), `${rotp.name} is still running once the host approved it and allowed its world`).toBe(false);
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

export { approveJoin, approveOf, checkJoinedOptions, startRotpA, waitForJoinRequest };
