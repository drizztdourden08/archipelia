/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SEAT_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { named } from './named';
import { tabBody } from './tab-body';

const checkSeatGrid = (tour: AppReviewTour, joiner: string) => {
  const root = tabBody(tour);
  const card = named(tour, SELECTOR.button, `Approve ${joiner}`, root)?.closest(SEAT_UI.card) ?? null;
  const waiting = card?.getAttribute('data-state') === SEAT_UI.pending && card.textContent.includes(SEAT_UI.refuse);
  tour.check('seat-pending', waiting, 'a player who joined waits on a highlighted seat card with Approve and Refuse on it', 'the player who joined has no highlighted seat card with Approve and Refuse');
  tour.check('seat-add', named(tour, SELECTOR.button, SEAT_UI.add, root) !== null, 'the seat grid ends with an Add player tile', 'the seat grid has no Add player tile');
};

export { checkSeatGrid };
