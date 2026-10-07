/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { waitNamed } from './wait-named';

const checkLiveStatus = async (tour: AppReviewTour): Promise<void> => {
  const frame = await tour.openWidget('players');
  const live = frame ? await waitNamed(tour, SELECTOR.status, 'Live', frame) : null;
  tour.check('live-status', live !== null, 'the players widget says Live', 'the players widget does not say Live');
};

export { checkLiveStatus };
