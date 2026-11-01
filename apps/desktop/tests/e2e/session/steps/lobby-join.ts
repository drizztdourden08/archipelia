/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { TEMPLATE } from '../../app/support/flow-constants';
import { settledProof } from '../../app/support/settled-proof';
import { lobbyTargetOf } from '../support/app-api';
import { lobbyJoinArgs } from '../support/rotp-args';
import { startRotp } from '../support/rotp-instance';
import type { RotpInstance } from '../support/rotp-instance';
import { RELIC, ROTP_A, TIMEOUT } from '../support/session-constants';
import type { SessionEnv } from '../support/session-env';
import type { SessionDirs } from './session-dirs.type';

// TODO(archipelia lead): the lobby has no host view of a joined player's options yet. These names are the assumed
// ones: a button on the joined seat that opens a region named after the options. Confirm them when the view lands.
const OPTIONS_VIEW = { open: /options/i, region: /options/i };

const EDITABLE_ROLES = ['textbox', 'combobox', 'switch', 'slider', 'spinbutton', 'checkbox', 'radio'] as const;

const startRotpA = async (launched: LaunchedApp, env: SessionEnv, dirs: SessionDirs): Promise<RotpInstance> => {
  const target = await lobbyTargetOf(launched, TEMPLATE);
  return startRotp({ name: ROTP_A.slot, env, args: (eventLog) => lobbyJoinArgs(env, dirs.profileA, eventLog, ROTP_A.yaml, target), profileDir: dirs.profileA, outDir: dirs.logs });
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

const expectReadOnly = async (region: Locator) => {
  for (const role of EDITABLE_ROLES) {
    for (const control of await region.getByRole(role).all()) {
      const locked = await control.evaluate((node) => node.matches(':disabled, [aria-disabled="true"], [aria-readonly="true"], [readonly]'));
      expect(locked, `a ${role} in the joined options is not editable`).toBe(true);
    }
  }
};

const checkJoinedOptions = async (launched: LaunchedApp, tab: Locator) => {
  await tab.getByRole('button', { name: OPTIONS_VIEW.open }).first().click();
  const region = tab.getByRole('region', { name: OPTIONS_VIEW.region });
  await region.waitFor();
  expect((await region.innerText()).trim(), 'the options of RotP-A are shown').not.toBe('');
  await expectReadOnly(region);
  await settledProof(launched, '56-lobby-joined-options-read-only');
};

export { approveJoin, checkJoinedOptions, startRotpA };
