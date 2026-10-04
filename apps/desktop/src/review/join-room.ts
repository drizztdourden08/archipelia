/* @layer renderer-app @kind logic */
import { Client, itemsHandlingFlags } from 'archipelago.js';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { REVIEW_CHECKS, REVIEW_GAME, REVIEW_PLAYERS } from './review.constants';

const joinRoom = async (tour: AppReviewTour, port: number): Promise<Client> => {
  const client = new Client({ timeout: 30000 });
  await client.login(`ws://127.0.0.1:${port}`, REVIEW_PLAYERS[0], REVIEW_GAME.game, { items: itemsHandlingFlags.all, slotData: false });
  const targets = client.room.missingLocations.slice(0, REVIEW_CHECKS);
  client.check(...targets);
  await tour.waitFor(() => client.room.checkedLocations.length >= targets.length, 10000);
  const next = client.room.missingLocations[0];
  if (next !== undefined) await client.messages.say(`!hint_location ${client.package.lookupLocationName(REVIEW_GAME.game, next)}`);
  await tour.delay(1500);
  return client;
};

export { joinRoom };
