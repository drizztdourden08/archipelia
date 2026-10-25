/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { askedForArt } from './asked-for-art';

const checkGameCards = async (tour: AppReviewTour): Promise<void> => {
  tour.check('games-enrich-after-dwell', await askedForArt(tour), 'cards in view ask for their summary and art after a short dwell', 'no card asked for its summary or art after it stayed in view');
};

export { checkGameCards };
