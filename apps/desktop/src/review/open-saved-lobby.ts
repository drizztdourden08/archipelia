/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LOBBY_UI, REVIEW_SESSION } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { closeLobby } from './close-lobby';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const openSavedLobby = async (tour: AppReviewTour) => {
  const layer = () => tour.find(SELECTOR.layer);
  await clickNamed(tour, SELECTOR.button, `Start ${REVIEW_SESSION}`, layer() ?? undefined);
  const opened = await waitText(tour, /Players · 2/, layer, 15000);
  tour.check('lobby-opens', opened, 'Start on a saved session opens its lobby screen with the two players saved with it', 'Start did not open the lobby screen with the saved players');
  const run = await waitNamed(tour, SELECTOR.button, LOBBY_UI.run, layer() ?? undefined);
  tour.check('lobby-run-ready', run instanceof HTMLButtonElement && !run.disabled, 'Run is on once the lobby has a player', 'Run is off on a lobby with two players');
  await tour.capture('session-lobby');
  await closeLobby(tour);
};

export { openSavedLobby };
