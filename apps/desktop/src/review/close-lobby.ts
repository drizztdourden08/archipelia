/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LOBBY_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const closeLobby = async (tour: AppReviewTour) => {
  const layer = () => tour.find(SELECTOR.layer);
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.close, layer() ?? undefined);
  const ask = await waitNamed(tour, SELECTOR.dialog, LOBBY_UI.closeTitle);
  if (ask) await clickNamed(tour, SELECTOR.button, LOBBY_UI.close, ask);
  const back = await waitText(tour, LOBBY_UI.setup, layer, 15000);
  tour.check('lobby-closes', ask !== null && back, 'Close lobby asks first, closes the lobby and goes back to the setup page', 'Close lobby did not return to the setup page');
};

export { closeLobby };
