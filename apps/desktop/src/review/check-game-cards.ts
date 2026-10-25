/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { askedForArt } from './asked-for-art';
import { OVERFLOW_BUTTON } from './check-game-cards.constants';
import { nameOf } from './name-of';
import { SELECTOR } from './review-dom.constants';

const actionNames = (tour: AppReviewTour, card: HTMLElement) =>
  tour.findAll('button', card).filter((button) => !button.matches(OVERFLOW_BUTTON)).map(nameOf);

const checkActionNames = async (tour: AppReviewTour): Promise<void> => {
  const card = await tour.waitFor(() => tour.find(`${SELECTOR.layer} .item-card`));
  const title = card?.querySelector('h3')?.textContent ?? '';
  const names = card ? actionNames(tour, card) : [];
  const named = title !== '' && names.length > 0 && names.every((name) => name.endsWith(` ${title}`));
  tour.check('games-card-action-names', named, 'each icon action of a game card is named with its action and the world', `a game card action is not named with the world "${title}": ${names.join(', ')}`);
};

const checkGameCards = async (tour: AppReviewTour): Promise<void> => {
  tour.check('games-enrich-after-dwell', await askedForArt(tour), 'cards in view ask for their summary and art after a short dwell', 'no card asked for its summary or art after it stayed in view');
  await checkActionNames(tour);
};

export { checkGameCards };
