/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { DIRECT_RUN_MS, LOBBY_UI, REVIEW_JOINER, REVIEW_PLAYER, REVIEW_PLAYERS } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { tabBody } from './tab-body';
import { directLobby } from './direct-lobby';
import { waitText } from './wait-text';

const layer = () => document.querySelector<HTMLElement>(SELECTOR.layer);

const runDirect = async (tour: AppReviewTour, lobbyId: string) => {
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.run, tabBody(tour));
  const hosting = await tour.waitFor(() => (directLobby(lobbyId)?.phase === 'hosting' ? true : null), DIRECT_RUN_MS);
  tour.check('direct-run', hosting === true, 'Run in the tab starts the lobby and the room is hosting', 'the session with direct connections did not reach hosting');
  if (!hosting) return;
  const files = [REVIEW_PLAYERS[0], REVIEW_PLAYER, REVIEW_JOINER].map((name) => `${name}.apreview`);
  const all = await tour.waitFor(() => (files.every((file) => directLobby(lobbyId)?.room?.files.some((made) => made.name === file)) ? true : null), 20000);
  tour.check('direct-one-seed', all === true, 'the one generation of the lobby made a file for the host player, the fake client and the Archipelia player', 'the results do not list a file for each kind of player');
  await tour.capture('direct-results');
  nav.open(ROUTE.joinSession);
  const room = await waitText(tour, /Room open[\s\S]*On this computer\s*127\.0\.0\.1:\d+/i, layer, 20000);
  tour.check('join-results', room, 'the joined session shows the room address and the address on this computer', 'the joined session does not show its room');
  await tour.capture('join-results');
};

export { runDirect };
