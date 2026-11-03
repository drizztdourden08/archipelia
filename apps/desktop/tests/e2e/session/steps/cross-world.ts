/* @layer tests @kind helper */
import { expect } from 'vitest';
import type { Client } from 'archipelago.js';
import { joinAs, waitFor } from '../../support/ap-player';
import { TEMPLATE } from '../../app/support/flow-constants';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { docked } from '../../app/support/locators';
import { settledProof } from '../../app/support/settled-proof';
import { roomTargetOf } from '../support/app-api';
import { eventsOf } from '../support/rotp-instance';
import type { RotpInstance } from '../support/rotp-instance';
import { BALDUR, ROTP_A, ROTP_B, TIMEOUT } from '../support/session-constants';
import { runConsoleCommand } from './console-command';

const sentLine = (receiver: string) => new RegExp(`${ROTP_B.slot} sent .+ to ${receiver}`);

const connectMinsc = async (launched: LaunchedApp): Promise<Client> => {
  const target = await roomTargetOf(launched, TEMPLATE, BALDUR.slot);
  return joinAs({ url: `ws://${target.host}:${target.port}`, slot: BALDUR.slot, game: BALDUR.game, password: target.password });
};

const sentToMinsc = (client: Client, from: number) =>
  client.items.received.slice(from).some((item) => item.sender.name === ROTP_B.slot);

const arrivedFromB = (entries: Record<string, unknown>[], from: number) =>
  entries.slice(from).some((entry) => entry.t === 'item-received' && entry.from === ROTP_B.slot && entry.self === false);

const logCount = (launched: LaunchedApp, receiver: string) => docked(launched.page).getByText(sentLine(receiver)).count();

const releaseRotpB = async (launched: LaunchedApp, minsc: Client, rotpA: RotpInstance) => {
  const before = {
    minsc: minsc.items.received.length,
    events: (await eventsOf(rotpA.eventLog)).length,
    toMinsc: await logCount(launched, BALDUR.slot),
    toA: await logCount(launched, ROTP_A.slot),
  };
  await runConsoleCommand(launched, `/release ${ROTP_B.slot}`);
  await waitFor(() => sentToMinsc(minsc, before.minsc), TIMEOUT.line, `an item from ${ROTP_B.slot} for ${BALDUR.slot}`);
  await expect.poll(async () => arrivedFromB(await eventsOf(rotpA.eventLog), before.events), { timeout: TIMEOUT.line, message: `${rotpA.name} logs an item from ${ROTP_B.slot}` }).toBe(true);
  await expect.poll(() => logCount(launched, BALDUR.slot), { timeout: TIMEOUT.line }).toBeGreaterThan(before.toMinsc);
  await expect.poll(() => logCount(launched, ROTP_A.slot), { timeout: TIMEOUT.line }).toBeGreaterThan(before.toA);
  await settledProof(launched, '62b-session-cross-world');
};

export { connectMinsc, releaseRotpB };
