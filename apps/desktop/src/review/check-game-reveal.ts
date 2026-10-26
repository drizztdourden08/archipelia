/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { REVEAL_GAME } from './check-game-reveal.constants';
import { REVIEW_GAME } from './review.constants';
import { SELECTOR } from './review-dom.constants';

const cardTitled = (tour: AppReviewTour, title: string) =>
  tour.findAll(`${SELECTOR.layer} .item-card`).find((card) => card.querySelector('h3')?.textContent === title) ?? null;

const checkGameReveal = async (tour: AppReviewTour): Promise<void> => {
  const before = cardTitled(tour, REVEAL_GAME.title);
  nav.open(ROUTE.games, { game: REVEAL_GAME.apworld });
  const card = await tour.waitFor(() => cardTitled(tour, REVEAL_GAME.title));
  const focused = card !== null && await tour.waitFor(() => (card.contains(document.activeElement) ? true : null)) === true;
  tour.check('games-reveal-unmounted', before === null && card !== null, `a search result scrolls to ${REVEAL_GAME.title} although it was not drawn`, `${REVEAL_GAME.title} was ${before === null ? 'never drawn' : 'already drawn, so nothing was tested'}`);
  tour.check('games-reveal-focus', focused, 'the card found by a search result takes the focus', 'the card found by a search result did not take the focus');
  nav.open(ROUTE.games, { game: REVIEW_GAME.apworld });
  await tour.waitFor(() => cardTitled(tour, REVIEW_GAME.card));
};

export { checkGameReveal };
