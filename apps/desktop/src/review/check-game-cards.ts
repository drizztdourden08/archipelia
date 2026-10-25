/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { askedForArt } from './asked-for-art';
import { SELECTOR } from './review-dom.constants';

const checkGameCards = async (tour: AppReviewTour, layer: HTMLElement): Promise<void> => {
  const cards = tour.findAll(SELECTOR.gameCard, layer);
  const compact = tour.findAll(SELECTOR.compactCard, layer);
  tour.check('games-compact-cards', cards.length > 0 && compact.length === cards.length, 'every game is a compact card', 'a game card is missing or is not compact');
  tour.check('games-enrich-after-dwell', await askedForArt(tour), 'cards in view ask for their summary and art after a short dwell', 'no card asked for its summary or art after it stayed in view');
};

export { checkGameCards };
