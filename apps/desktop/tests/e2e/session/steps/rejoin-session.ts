/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Locator } from 'playwright-core';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { docked } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { joinRefusalOf } from '../support/rotp-console';
import { eventsOf, stopRotp } from '../support/rotp-instance';
import type { RotpInstance } from '../support/rotp-instance';
import { ROTP_A, TIMEOUT } from '../support/session-constants';
import type { SessionEnv } from '../support/session-env';
import { approveOf, startRotpA } from './lobby-join';
import { playerRow } from './play-session';
import type { SessionDirs } from './session-dirs.type';

const REJOIN_NAME = `${ROTP_A.slot}-rejoin`;

const CONNECTED = 'connected';

const connectedRow = (launched: LaunchedApp) => playerRow(docked(launched.page), ROTP_A.slot).getByText(CONNECTED, { exact: true });

const closeRotpA = async (launched: LaunchedApp, rotp: RotpInstance) => {
  await stopRotp(rotp);
  expect(rotp.exited(), `${rotp.name} is closed`).toBe(true);
  await connectedRow(launched).waitFor({ state: 'detached', timeout: TIMEOUT.line });
};

const reopenRotpA = (launched: LaunchedApp, env: SessionEnv, dirs: SessionDirs) => startRotpA(launched, env, dirs, REJOIN_NAME);

const hasConnected = async (rotp: RotpInstance) => (await eventsOf(rotp.eventLog)).some((entry) => entry.t === CONNECTED);

const expectRejoined = async (launched: LaunchedApp, tab: Locator, rotp: RotpInstance) => {
  await connectedRow(launched).waitFor({ timeout: TIMEOUT.join });
  await expect.poll(() => hasConnected(rotp), { timeout: TIMEOUT.join, message: `${rotp.name} logs connected after the restart` }).toBe(true);
  expect(await joinRefusalOf(rotp.eventLog), `${rotp.name} is not refused`).toBeUndefined();
  expect(rotp.exited(), `${rotp.name} is still running once it rejoined`).toBe(false);
  expect(await approveOf(tab).count(), 'the host shows no new join request').toBe(0);
  await settledProof(launched, '62a-session-rejoin');
};

export { closeRotpA, expectRejoined, reopenRotpA };
