/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { openSessionEditor } from '../hooks/open-session-editor';
import { DIRECT_UI, REVIEW_JOINER, REVIEW_PLAYER, REVIEW_PLAYERS } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { directLobby } from './direct-lobby';
import { waitText } from './wait-text';

const layer = () => document.querySelector<HTMLElement>(SELECTOR.layer);

const RUN_WAIT_MS = 30000;

const runDirect = async (tour: AppReviewTour, templateId: string, lobbyId: string) => {
  await clickNamed(tour, SELECTOR.button, DIRECT_UI.run, tour.find(SELECTOR.layer) ?? undefined);
  const hosting = await tour.waitFor(() => (directLobby(lobbyId)?.phase === 'hosting' ? true : null), RUN_WAIT_MS);
  tour.check('direct-run', hosting === true, 'Run starts the lobby of the session and the room is hosting', 'the session with direct connection did not reach hosting');
  if (!hosting) return;
  openSessionEditor(templateId);
  const files = [REVIEW_PLAYERS[0], REVIEW_PLAYER, REVIEW_JOINER].map((name) => `${name}.apreview`);
  const all = await tour.waitFor(() => (files.every((file) => (layer()?.innerText ?? '').includes(file)) ? true : null), 20000);
  tour.check('direct-one-seed', all === true,'one generation holds the host player, the fake client and the Archipelia player', 'the results do not list a file for each kind of player');
  await tour.capture('direct-results');
  nav.open(ROUTE.joinSession);
  const room = await waitText(tour, /Room open[\s\S]*On this computer\s*127\.0\.0\.1:\d+/, layer, 20000);
  tour.check('join-results', room, 'the joined session shows the room address and the address on this computer', 'the joined session does not show its room');
  await tour.capture('join-results');
};

export { runDirect };
