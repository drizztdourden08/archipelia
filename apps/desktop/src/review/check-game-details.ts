/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { checkVersionPicker } from './check-version-picker';
import { clickNamed } from './click-named';
import { named } from './named';
import { REVIEW_GAME } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { waitNamed } from './wait-named';

const checkGameDetails = async (tour: AppReviewTour, layer: HTMLElement | undefined): Promise<void> => {
  const clicked = layer ? await clickNamed(tour, SELECTOR.button, REVIEW_GAME.card, layer) : false;
  const dialog = clicked ? await waitNamed(tour, SELECTOR.dialog, REVIEW_GAME.card) : null;
  tour.check('games-details-open', dialog !== null, 'the title of a card opens its details dialog', 'the title of a card did not open its details dialog');
  if (dialog === null) return;
  checkVersionPicker(tour, dialog);
  await tour.capture('games-details');
  tour.press({ key: 'Escape' });
  const closed = await tour.waitFor(() => (named(tour, SELECTOR.dialog, REVIEW_GAME.card) ? null : true));
  tour.check('games-details-escape', closed === true, 'Escape closes the details dialog', 'Escape left the details dialog open');
};

export { checkGameDetails };
