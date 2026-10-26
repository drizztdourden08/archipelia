/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { DIRECT_UI, HOST_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { nameOf } from './name-of';
import { named } from './named';
import { waitText } from './wait-text';

const free = (element: HTMLElement | null) => element !== null && !element.hasAttribute('disabled') && element.getAttribute('aria-disabled') !== 'true';

const checkWhere = async (tour: AppReviewTour) => {
  const layer = () => tour.find(SELECTOR.layer);
  const placeChoice = () => tour.findAll(SELECTOR.segment, layer() ?? undefined).map(nameOf).filter((name) => [HOST_UI.local, HOST_UI.lan, HOST_UI.remote].some((label) => label.test(name)));
  const asked = await waitText(tour, DIRECT_UI.section, layer);
  const options = await tour.waitFor(() => (placeChoice().length === 3 ? true : null));
  tour.check('hosting-choice', asked && options === true, 'How players join offers one Where choice: Local, LAN and Remote', 'the Where choice is missing or incomplete');
  tour.check('hosting-lan-free', free(named(tour, SELECTOR.segment, HOST_UI.lan, layer() ?? undefined)), 'LAN is open to pick with direct connections off', 'LAN is off while direct connections are off');
  await tour.capture('setup-where');
};

export { checkWhere };
