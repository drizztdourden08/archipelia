/* @layer tests @kind helper */
import { Client, itemsHandlingFlags } from 'archipelago.js';

type PlayerOptions = { url: string; slot: string; game: string; password?: string };

const waitFor = async (probe: () => boolean, timeoutMs: number, what: string) => {
  const started = Date.now();
  while (!probe()) {
    if (Date.now() - started > timeoutMs) throw new Error(`timed out waiting for ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

const joinAs = async ({ url, slot, game, password }: PlayerOptions) => {
  const client = new Client({ autoFetchDataPackage: false, timeout: 60000 });
  await client.login(url, slot, game, { password: password ?? '', items: itemsHandlingFlags.all, slotData: true });
  return client;
};

const checkSome = async (client: Client, count: number) => {
  const targets = client.room.missingLocations.slice(0, count);
  const before = client.room.checkedLocations.length;
  client.check(...targets);
  await waitFor(() => client.room.checkedLocations.length >= before + targets.length, 15000, `${targets.length} checks`);
  return targets;
};

const checkAll = (client: Client) => checkSome(client, client.room.missingLocations.length);

const waitForItems = (client: Client, count: number, timeoutMs = 20000) =>
  waitFor(() => client.items.received.length >= count, timeoutMs, `${count} received items`);

const reachGoal = (client: Client) => client.goal();

export { checkAll, checkSome, joinAs, reachGoal, waitFor, waitForItems };