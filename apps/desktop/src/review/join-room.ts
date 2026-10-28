/* @layer renderer-app @kind logic */
import { Client, itemsHandlingFlags } from 'archipelago.js';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { MS_PER_SECOND, REVIEW_CHECKS, REVIEW_GAME, REVIEW_PLAYERS, SERVER_ANSWER_MS } from './review.constants';
import { serverListens } from './server-listens';

const play = async (tour: AppReviewTour, client: Client): Promise<void> => {
  const targets = client.room.missingLocations.slice(0, REVIEW_CHECKS);
  client.check(...targets);
  const checked = await tour.waitFor(() => client.room.checkedLocations.length >= targets.length, SERVER_ANSWER_MS);
  if (!checked) throw new Error(`the server did not take ${targets.length} checks within ${SERVER_ANSWER_MS / MS_PER_SECOND} s`);
  const next = client.room.missingLocations[0];
  if (next === undefined) return;
  await client.messages.say(`!hint_location ${client.package.lookupLocationName(REVIEW_GAME.game, next)}`);
  await tour.waitFor(() => client.items.hints.length > 0, SERVER_ANSWER_MS);
};

const joinRoom = async (tour: AppReviewTour, port: number, password?: string): Promise<Client> => {
  await serverListens(tour, port);
  const client = new Client({ timeout: 30000 });
  try {
    await client.login(`ws://127.0.0.1:${port}`, REVIEW_PLAYERS[0], REVIEW_GAME.game, { items: itemsHandlingFlags.all, slotData: false, ...(password ? { password } : {}) });
    await play(tour, client);
  } catch (error) {
    client.socket.disconnect();
    throw error;
  }
  return client;
};

export { joinRoom };
