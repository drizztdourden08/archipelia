/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { REVIEW_GAME } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitNamed } from './wait-named';

const installed = async () => (await appApi().gamesList()).some((game) => game.apworld === REVIEW_GAME.apworld);

const goneWithin = async (tries: number, wait: (ms: number) => Promise<void>): Promise<boolean> => {
  for (let left = tries; left > 0; left -= 1) {
    if (!(await installed())) return true;
    await wait(1000);
  }
  return false;
};

export default defineReviewStep({
  run: async (tour) => {
    nav.open(ROUTE.installedGames);
    await clickNamed(tour, SELECTOR.button, `Remove ${REVIEW_GAME.card}`, tour.find(SELECTOR.layer) ?? undefined);
    const confirm = await waitNamed(tour, SELECTOR.dialog, `Delete ${REVIEW_GAME.card}?`);
    tour.check('game-delete-asks', confirm !== null, `removing asks Delete ${REVIEW_GAME.card}?`, 'removing the game did not ask first');
    if (confirm) await clickNamed(tour, SELECTOR.button, 'Delete', confirm);
    const removed = await goneWithin(15, tour.delay);
    tour.check('game-removed', removed, `${REVIEW_GAME.card} leaves the engine, so the next run of the UI suite starts clean`, `${REVIEW_GAME.card} is still installed`);
    await tour.capture('game-removed');
  },
});
