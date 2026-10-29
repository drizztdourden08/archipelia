/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { REVIEW_GAME, SEAT_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { tabBody } from './tab-body';

const pickGame = async (tour: AppReviewTour): Promise<boolean> => {
  const select = await tour.waitFor(() => tour.find(`[data-cell="game"] ${SELECTOR.combobox}`, tabBody(tour)));
  if (!select) return false;
  tour.click(select);
  return clickNamed(tour, '[role="option"]', REVIEW_GAME.game);
};

const addLobbyPlayer = async (tour: AppReviewTour): Promise<void> => {
  await clickNamed(tour, SELECTOR.button, SEAT_UI.add, tabBody(tour));
  const picked = await pickGame(tour);
  tour.check('lobby-stage-add', picked, `Add player adds a seat and its editor sets the game to ${REVIEW_GAME.game}`, 'Add player did not open an editor with a game picker');
  await clickNamed(tour, SELECTOR.button, SEAT_UI.done, tabBody(tour));
  await tour.settle();
};

export { addLobbyPlayer };
