/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { REVIEW_GAME, SEAT_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { tabBody } from './tab-body';

const pickGame = async (tour: AppReviewTour): Promise<boolean> => {
  const fresh = tour.findAll(`${SEAT_UI.card}[data-state="${SEAT_UI.fresh}"]`, tabBody(tour))[0];
  if (fresh) await clickNamed(tour, SELECTOR.segment, SEAT_UI.set, fresh);
  const select = await tour.waitFor(() => tour.find(`[data-cell="game"] ${SELECTOR.combobox}`));
  if (!select) return false;
  tour.click(select);
  return clickNamed(tour, '[role="option"]', REVIEW_GAME.game);
};

const addLobbyPlayer = async (tour: AppReviewTour): Promise<void> => {
  await clickNamed(tour, SELECTOR.button, SEAT_UI.add, tabBody(tour));
  const picked = await pickGame(tour);
  tour.check('lobby-stage-add', picked, `Add player adds a seat and its editor sets the game to ${REVIEW_GAME.game}`, 'Add player did not open an editor with a game picker');
  await clickNamed(tour, SELECTOR.button, SEAT_UI.done);
  await tour.settle();
};

export { addLobbyPlayer };
