/* @layer tests @kind helper */
import { rm } from 'node:fs/promises';
import type { Client } from 'archipelago.js';
import type { LaunchedApp } from './launched-app.type';
import { removeLeftWorlds } from './engine-cleanup';
import { base, dialogOf, hub } from './locators';
import type { HubTitle } from './locators';

const QUICK = { timeout: 5000 };

const HUBS: HubTitle[] = ['Multiworld', 'Data'];

const closeOpenHubs = async ({ page }: LaunchedApp) => {
  for (const title of HUBS) {
    const opened = hub(page, title);
    if (await opened.count()) await opened.getByRole('button', { name: 'Close', exact: true }).first().click(QUICK);
  }
};

const stopIfHosting = async (launched: LaunchedApp) => {
  const { page } = launched;
  await closeOpenHubs(launched);
  const stop = base(page).getByRole('button', { name: 'Stop', exact: true });
  if (!(await stop.count()) || await stop.isDisabled()) return;
  await stop.click(QUICK);
  await dialogOf(page, 'Stop the room').getByRole('button', { name: 'Stop', exact: true }).click(QUICK);
  await stop.waitFor({ state: 'attached', ...QUICK });
};

const attempt = async (work: () => Promise<unknown>, notes: string[], what: string) => {
  try {
    await work();
  } catch (err) {
    notes.push(`${what}: ${(err as Error).message.split('\n')[0]}`);
  }
};

const tearDown = async (launched: LaunchedApp | undefined, clients: Client[]) => {
  const notes: string[] = [];
  clients.forEach((client) => client.socket.disconnect());
  if (!launched) return notes;
  await attempt(() => stopIfHosting(launched), notes, 'stop the room');
  await attempt(() => launched.app.close(), notes, 'close the app');
  await attempt(async () => {
    const left = await removeLeftWorlds(launched.userData);
    if (left.length) notes.push(`removed worlds the flow left behind: ${left.join(', ')}`);
  }, notes, 'remove worlds');
  await attempt(() => rm(launched.userData, { recursive: true, force: true, maxRetries: 5 }), notes, 'delete user data');
  return notes;
};

export { tearDown };
