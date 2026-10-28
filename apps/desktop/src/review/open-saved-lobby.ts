/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LOBBY_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { stripHas } from './strip-has';
import { tabBody } from './tab-body';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const openSavedLobby = async (tour: AppReviewTour, title: string, capture?: string) => {
  const layer = () => tour.find(SELECTOR.layer);
  await clickNamed(tour, SELECTOR.button, new RegExp(`^${title}\b`), layer() ?? undefined);
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.run, layer() ?? undefined);
  const opened = await waitText(tour, /Players · 2/i, () => tabBody(tour) ?? null, 15000);
  tour.check('lobby-opens', opened, 'Run on a saved session opens its tab with the two players saved with it', 'Run did not open a tab with the saved players');
  const labelled = await stripHas(tour, title, 'Lobby');
  tour.check('lobby-tab', labelled, 'the tab is named after the session and its status says Lobby', 'the tab does not say it is in the lobby phase');
  const run = await waitNamed(tour, SELECTOR.button, LOBBY_UI.run, tabBody(tour));
  tour.check('lobby-run-ready', run instanceof HTMLButtonElement && !run.disabled, 'Run is on once the lobby has a player', 'Run is off on a lobby with two players');
  if (capture) await tour.capture(capture);
};

export { openSavedLobby };
